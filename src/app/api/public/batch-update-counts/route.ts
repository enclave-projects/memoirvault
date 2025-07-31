import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles, userFollows, publicEntryVisibility } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userIds } = await request.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'User IDs array is required' }, { status: 400 });
        }

        // Batch query to get all counts at once
        const countsQuery = sql`
            SELECT 
                p.user_id,
                COALESCE(followers.count, 0) as followers_count,
                COALESCE(following.count, 0) as following_count,
                COALESCE(entries.count, 0) as public_entries_count
            FROM ${publicProfiles} p
            LEFT JOIN (
                SELECT following_user_id, COUNT(*) as count
                FROM ${userFollows}
                WHERE following_user_id = ANY(${userIds})
                GROUP BY following_user_id
            ) followers ON p.user_id = followers.following_user_id
            LEFT JOIN (
                SELECT follower_user_id, COUNT(*) as count
                FROM ${userFollows}
                WHERE follower_user_id = ANY(${userIds})
                GROUP BY follower_user_id
            ) following ON p.user_id = following.follower_user_id
            LEFT JOIN (
                SELECT user_id, COUNT(*) as count
                FROM ${publicEntryVisibility}
                WHERE user_id = ANY(${userIds}) AND is_public = true
                GROUP BY user_id
            ) entries ON p.user_id = entries.user_id
            WHERE p.user_id = ANY(${userIds})
        `;

        const results = await db.execute(countsQuery);

        // Batch update all profiles
        const updatePromises = results.rows.map((row: any) => 
            db.update(publicProfiles)
                .set({
                    followersCount: parseInt(row.followers_count) || 0,
                    followingCount: parseInt(row.following_count) || 0,
                    publicEntriesCount: parseInt(row.public_entries_count) || 0,
                    updatedAt: new Date(),
                })
                .where(eq(publicProfiles.userId, row.user_id))
        );

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: `Updated counts for ${results.rows.length} profiles`,
            updatedCount: results.rows.length
        });

    } catch (error) {
        console.error('Error batch updating counts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}