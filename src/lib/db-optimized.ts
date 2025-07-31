import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { cache, cacheUtils } from './cache';

// Create connection
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);

// Optimized query helpers
export const optimizedQueries = {
  // Batch get multiple profiles with counts
  async getProfilesWithCounts(userIds: string[]) {
    const cacheKey = `profiles_batch:${userIds.sort().join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const query = sql`
      SELECT 
        p.*,
        COALESCE(followers.count, 0) as followers_count,
        COALESCE(following.count, 0) as following_count,
        COALESCE(entries.count, 0) as public_entries_count
      FROM public_profiles p
      LEFT JOIN (
        SELECT following_user_id, COUNT(*) as count
        FROM user_follows
        WHERE following_user_id = ANY(${userIds})
        GROUP BY following_user_id
      ) followers ON p.user_id = followers.following_user_id
      LEFT JOIN (
        SELECT follower_user_id, COUNT(*) as count
        FROM user_follows
        WHERE follower_user_id = ANY(${userIds})
        GROUP BY follower_user_id
      ) following ON p.user_id = following.follower_user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as count
        FROM public_entry_visibility
        WHERE user_id = ANY(${userIds}) AND is_public = true
        GROUP BY user_id
      ) entries ON p.user_id = entries.user_id
      WHERE p.user_id = ANY(${userIds})
    `;

    const result = await query;
    cache.set(cacheKey, result, 180); // 3 minutes cache
    return result;
  },

  // Get follow status for multiple users at once
  async getBatchFollowStatus(currentUserId: string, targetUserIds: string[]) {
    const cacheKey = `follow_batch:${currentUserId}:${targetUserIds.sort().join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const query = sql`
      SELECT 
        following_user_id,
        CASE WHEN id IS NOT NULL THEN true ELSE false END as is_following
      FROM user_follows
      WHERE follower_user_id = ${currentUserId} 
        AND following_user_id = ANY(${targetUserIds})
    `;

    const result = await query;
    const followMap = new Map();
    
    // Initialize all as false
    targetUserIds.forEach(id => followMap.set(id, false));
    
    // Set true for actual follows
    result.forEach((row: any) => {
      followMap.set(row.following_user_id, row.is_following);
    });

    const followStatus = Object.fromEntries(followMap);
    cache.set(cacheKey, followStatus, 300); // 5 minutes cache
    return followStatus;
  },

  // Optimized entry visibility batch update
  async batchUpdateEntryVisibility(userId: string, entryIds: string[], isPublic: boolean) {
    // Invalidate related caches
    cacheUtils.invalidateProfile(userId);

    const query = sql`
      INSERT INTO public_entry_visibility (entry_id, user_id, is_public, made_public_at, created_at, updated_at)
      SELECT 
        unnest(${entryIds}::uuid[]) as entry_id,
        ${userId} as user_id,
        ${isPublic} as is_public,
        ${isPublic ? new Date() : null} as made_public_at,
        NOW() as created_at,
        NOW() as updated_at
      ON CONFLICT (entry_id, user_id) 
      DO UPDATE SET 
        is_public = EXCLUDED.is_public,
        made_public_at = EXCLUDED.made_public_at,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `;

    return await query;
  },

  // Fast count updates using single query
  async updateProfileCounts(userId: string) {
    const query = sql`
      UPDATE public_profiles 
      SET 
        followers_count = (
          SELECT COUNT(*) FROM user_follows 
          WHERE following_user_id = ${userId}
        ),
        following_count = (
          SELECT COUNT(*) FROM user_follows 
          WHERE follower_user_id = ${userId}
        ),
        public_entries_count = (
          SELECT COUNT(*) FROM public_entry_visibility 
          WHERE user_id = ${userId} AND is_public = true
        ),
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `;

    // Invalidate cache
    cacheUtils.invalidateProfile(userId);
    
    return await query;
  }
};

// Connection health check
export async function checkDbHealth() {
  try {
    const result = await sql`SELECT 1 as health`;
    return result.length > 0;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}