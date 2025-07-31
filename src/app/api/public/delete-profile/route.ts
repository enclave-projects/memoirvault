import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles, userFollows, publicEntryVisibility } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(_request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete all related data (Neon HTTP doesn't support transactions, so we do it sequentially)
        try {
            // First, get the profile to update follower/following counts for other users
            const profileToDelete = await db
                .select()
                .from(publicProfiles)
                .where(eq(publicProfiles.userId, userId))
                .limit(1);

            if (profileToDelete.length === 0) {
                return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
            }

            // const profile = profileToDelete[0]; // Unused variable removed

            // Get all users who follow this user (to update their following count)
            const followers = await db
                .select({ followerUserId: userFollows.followerUserId })
                .from(userFollows)
                .where(eq(userFollows.followingUserId, userId));

            // Get all users this user follows (to update their followers count)
            const following = await db
                .select({ followingUserId: userFollows.followingUserId })
                .from(userFollows)
                .where(eq(userFollows.followerUserId, userId));

            // Delete all follow relationships where this user is the follower
            await db.delete(userFollows)
                .where(eq(userFollows.followerUserId, userId));

            // Delete all follow relationships where this user is being followed
            await db.delete(userFollows)
                .where(eq(userFollows.followingUserId, userId));

            // Recalculate and update actual counts for users who were following this user
            for (const follower of followers) {
                // Count actual following relationships for this user
                const actualFollowingCount = await db
                    .select({ count: sql<number>`COUNT(*)` })
                    .from(userFollows)
                    .where(eq(userFollows.followerUserId, follower.followerUserId));

                await db
                    .update(publicProfiles)
                    .set({
                        followingCount: actualFollowingCount[0]?.count || 0,
                        updatedAt: new Date(),
                    })
                    .where(eq(publicProfiles.userId, follower.followerUserId));
            }

            // Recalculate and update actual counts for users this user was following
            for (const followedUser of following) {
                // Count actual followers for this user
                const actualFollowersCount = await db
                    .select({ count: sql<number>`COUNT(*)` })
                    .from(userFollows)
                    .where(eq(userFollows.followingUserId, followedUser.followingUserId));

                await db
                    .update(publicProfiles)
                    .set({
                        followersCount: actualFollowersCount[0]?.count || 0,
                        updatedAt: new Date(),
                    })
                    .where(eq(publicProfiles.userId, followedUser.followingUserId));
            }

            // Delete all public entry visibility records
            await db.delete(publicEntryVisibility)
                .where(eq(publicEntryVisibility.userId, userId));

            // Finally, delete the public profile
            await db.delete(publicProfiles)
                .where(eq(publicProfiles.userId, userId));

        } catch (error) {
            console.error('Error during profile deletion:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Public profile deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting public profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}