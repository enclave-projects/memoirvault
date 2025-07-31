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

        let fixedProfiles = 0;
        let errors = [];

        try {
            // Get all public profiles
            const allProfiles = await db
                .select()
                .from(publicProfiles);

            console.log(`Found ${allProfiles.length} profiles to fix`);

            // Fix counts for each profile
            for (const profile of allProfiles) {
                try {
                    // Count actual followers
                    const followersResult = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(userFollows)
                        .where(eq(userFollows.followingUserId, profile.userId));

                    const actualFollowersCount = followersResult[0]?.count || 0;

                    // Count actual following
                    const followingResult = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(userFollows)
                        .where(eq(userFollows.followerUserId, profile.userId));

                    const actualFollowingCount = followingResult[0]?.count || 0;

                    // Count actual public entries
                    const publicEntriesResult = await db
                        .select({ count: sql<number>`COUNT(*)` })
                        .from(publicEntryVisibility)
                        .where(
                            sql`${publicEntryVisibility.userId} = ${profile.userId} AND ${publicEntryVisibility.isPublic} = true`
                        );

                    const actualPublicEntriesCount = publicEntriesResult[0]?.count || 0;

                    // Check if counts need updating
                    const needsUpdate = 
                        profile.followersCount !== actualFollowersCount ||
                        profile.followingCount !== actualFollowingCount ||
                        profile.publicEntriesCount !== actualPublicEntriesCount;

                    if (needsUpdate) {
                        console.log(`Fixing counts for ${profile.username}:`);
                        console.log(`  Followers: ${profile.followersCount} → ${actualFollowersCount}`);
                        console.log(`  Following: ${profile.followingCount} → ${actualFollowingCount}`);
                        console.log(`  Public Entries: ${profile.publicEntriesCount} → ${actualPublicEntriesCount}`);

                        // Update the profile with correct counts
                        await db
                            .update(publicProfiles)
                            .set({
                                followersCount: actualFollowersCount,
                                followingCount: actualFollowingCount,
                                publicEntriesCount: actualPublicEntriesCount,
                                updatedAt: new Date(),
                            })
                            .where(eq(publicProfiles.userId, profile.userId));

                        fixedProfiles++;
                    }

                } catch (profileError) {
                    console.error(`Error fixing profile ${profile.username}:`, profileError);
                    errors.push(`Failed to fix ${profile.username}: ${profileError.message}`);
                }
            }

        } catch (error) {
            console.error('Error during count fixing:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: `Count fixing completed. Fixed ${fixedProfiles} profiles.`,
            results: {
                totalProfiles: allProfiles?.length || 0,
                fixedProfiles,
                errors: errors.length > 0 ? errors : undefined
            }
        });

    } catch (error) {
        console.error('Error fixing counts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}