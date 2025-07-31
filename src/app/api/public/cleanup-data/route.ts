import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles, userFollows, publicEntryVisibility, entries } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(_request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cleanupResults = {
            orphanedFollows: 0,
            orphanedVisibility: 0,
            updatedCounts: 0,
        };

        try {
            // Get all existing public profile user IDs
            const existingProfiles = await db
                .select({ userId: publicProfiles.userId })
                .from(publicProfiles);
            
            const existingUserIds = existingProfiles.map(p => p.userId);

            if (existingUserIds.length > 0) {
                // Clean up orphaned follow relationships (where either user doesn't have a public profile)
                await db
                    .delete(userFollows)
                    .where(
                        sql`${userFollows.followerUserId} NOT IN (${sql.join(existingUserIds.map(id => sql`${id}`), sql`, `)}) OR ${userFollows.followingUserId} NOT IN (${sql.join(existingUserIds.map(id => sql`${id}`), sql`, `)})`
                    );

                // Get all existing entry IDs
                const existingEntries = await db
                    .select({ id: entries.id })
                    .from(entries);
                
                const existingEntryIds = existingEntries.map(e => e.id);

                if (existingEntryIds.length > 0) {
                    // Clean up orphaned entry visibility records (where entry doesn't exist)
                    await db
                        .delete(publicEntryVisibility)
                        .where(
                            sql`${publicEntryVisibility.entryId} NOT IN (${sql.join(existingEntryIds.map(id => sql`${id}`), sql`, `)})`
                        );
                }

                // Recalculate and update follower/following counts for all profiles
                for (const profile of existingProfiles) {
                    // Count actual followers
                    const followersCount = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(userFollows)
                        .where(eq(userFollows.followingUserId, profile.userId));

                    // Count actual following
                    const followingCount = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(userFollows)
                        .where(eq(userFollows.followerUserId, profile.userId));

                    // Count actual public entries
                    const publicEntriesCount = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(publicEntryVisibility)
                        .where(
                            sql`${publicEntryVisibility.userId} = ${profile.userId} AND ${publicEntryVisibility.isPublic} = true`
                        );

                    // Update the profile with correct counts
                    await db
                        .update(publicProfiles)
                        .set({
                            followersCount: followersCount[0]?.count || 0,
                            followingCount: followingCount[0]?.count || 0,
                            publicEntriesCount: publicEntriesCount[0]?.count || 0,
                            updatedAt: new Date(),
                        })
                        .where(eq(publicProfiles.userId, profile.userId));

                    cleanupResults.updatedCounts++;
                }
            }

        } catch (error) {
            console.error('Error during data cleanup:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Data cleanup completed successfully',
            results: cleanupResults
        });

    } catch (error) {
        console.error('Error cleaning up data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}