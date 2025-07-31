import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userFollows, publicProfiles } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, action } = await request.json();

    if (!targetUserId || !action) {
      return NextResponse.json({ 
        error: 'Target user ID and action are required' 
      }, { status: 400 });
    }

    if (action !== 'follow' && action !== 'unfollow') {
      return NextResponse.json({ 
        error: 'Action must be either "follow" or "unfollow"' 
      }, { status: 400 });
    }

    if (userId === targetUserId) {
      return NextResponse.json({ 
        error: 'You cannot follow yourself' 
      }, { status: 400 });
    }

    // Single query to get both profiles and existing follow relationship
    const profilesAndFollowQuery = sql`
      SELECT 
        tp.user_id as target_user_id,
        tp.full_name as target_full_name,
        tp.followers_count as target_followers_count,
        cp.user_id as current_user_id,
        cp.following_count as current_following_count,
        CASE WHEN uf.id IS NOT NULL THEN true ELSE false END as is_following
      FROM ${publicProfiles} tp
      CROSS JOIN ${publicProfiles} cp
      LEFT JOIN ${userFollows} uf ON uf.follower_user_id = cp.user_id AND uf.following_user_id = tp.user_id
      WHERE tp.user_id = ${targetUserId} AND cp.user_id = ${userId}
    `;

    const result = await db.execute(profilesAndFollowQuery);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'One or both users do not have public profiles' 
      }, { status: 404 });
    }

    const data = result.rows[0] as any;
    const isCurrentlyFollowing = data.is_following;

    if (action === 'follow') {
      if (isCurrentlyFollowing) {
        return NextResponse.json({ 
          error: 'You are already following this user' 
        }, { status: 400 });
      }

      // Optimistic update: increment counts immediately
      const optimisticUpdates = Promise.all([
        db.update(publicProfiles)
          .set({ 
            followersCount: (data.target_followers_count || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(publicProfiles.userId, targetUserId)),
        db.update(publicProfiles)
          .set({ 
            followingCount: (data.current_following_count || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(publicProfiles.userId, userId))
      ]);

      // Create follow relationship and update counts in parallel
      const [_, __] = await Promise.all([
        db.insert(userFollows).values({
          followerUserId: userId,
          followingUserId: targetUserId,
        }),
        optimisticUpdates
      ]);

      return NextResponse.json({ 
        success: true, 
        action: 'followed',
        message: `You are now following ${data.target_full_name}`,
        optimistic: {
          targetFollowersCount: (data.target_followers_count || 0) + 1,
          currentFollowingCount: (data.current_following_count || 0) + 1
        }
      });

    } else { // unfollow
      if (!isCurrentlyFollowing) {
        return NextResponse.json({ 
          error: 'You are not following this user' 
        }, { status: 400 });
      }

      // Optimistic update: decrement counts immediately
      const optimisticUpdates = Promise.all([
        db.update(publicProfiles)
          .set({ 
            followersCount: Math.max(0, (data.target_followers_count || 0) - 1),
            updatedAt: new Date()
          })
          .where(eq(publicProfiles.userId, targetUserId)),
        db.update(publicProfiles)
          .set({ 
            followingCount: Math.max(0, (data.current_following_count || 0) - 1),
            updatedAt: new Date()
          })
          .where(eq(publicProfiles.userId, userId))
      ]);

      // Remove follow relationship and update counts in parallel
      const [_, __] = await Promise.all([
        db.delete(userFollows)
          .where(
            and(
              eq(userFollows.followerUserId, userId),
              eq(userFollows.followingUserId, targetUserId)
            )
          ),
        optimisticUpdates
      ]);

      return NextResponse.json({ 
        success: true, 
        action: 'unfollowed',
        message: `You have unfollowed ${data.target_full_name}`,
        optimistic: {
          targetFollowersCount: Math.max(0, (data.target_followers_count || 0) - 1),
          currentFollowingCount: Math.max(0, (data.current_following_count || 0) - 1)
        }
      });
    }

  } catch (error) {
    console.error('Error handling follow/unfollow:', error);
    return NextResponse.json(
      { error: 'Failed to process follow/unfollow request' },
      { status: 500 }
    );
  }
}