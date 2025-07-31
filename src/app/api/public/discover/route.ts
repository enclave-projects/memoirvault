import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publicProfiles, entries, publicEntryVisibility } from '@/lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get all active public profiles
    const profiles = await db
      .select({
        id: publicProfiles.id,
        userId: publicProfiles.userId,
        username: publicProfiles.username,
        fullName: publicProfiles.fullName,
        bio: publicProfiles.bio,
        profilePicture: publicProfiles.profilePicture,
        followersCount: publicProfiles.followersCount,
        followingCount: publicProfiles.followingCount,
        publicEntriesCount: publicProfiles.publicEntriesCount,
        createdAt: publicProfiles.createdAt,
      })
      .from(publicProfiles)
      .where(eq(publicProfiles.isActive, true))
      .orderBy(desc(publicProfiles.createdAt));

    // Update public entries count for each profile
    const profilesWithCounts = await Promise.all(
      profiles.map(async (profile) => {
        let publicEntriesCount = 0;

        if (profile.userId) {
          if (profile.publicEntriesCount === 0) {
            // Calculate actual public entries count
            if (await isJourneyPublic(profile.userId)) {
              // Count all entries if journey is public
              const allEntriesCount = await db
                .select({ count: count() })
                .from(entries)
                .where(eq(entries.userId, profile.userId));
              
              publicEntriesCount = allEntriesCount[0]?.count || 0;
            } else {
              // Count only specifically public entries
              const specificPublicCount = await db
                .select({ count: count() })
                .from(entries)
                .innerJoin(publicEntryVisibility, eq(entries.id, publicEntryVisibility.entryId))
                .where(
                  eq(entries.userId, profile.userId)
                );
              
              publicEntriesCount = specificPublicCount[0]?.count || 0;
            }

            // Update the count in the database
            await db
              .update(publicProfiles)
              .set({ 
                publicEntriesCount: publicEntriesCount,
                updatedAt: new Date()
              })
              .where(eq(publicProfiles.userId, profile.userId));
          } else {
            publicEntriesCount = profile.publicEntriesCount;
          }
        }

        return {
          ...profile,
          publicEntriesCount,
        };
      })
    );

    return NextResponse.json({
      profiles: profilesWithCounts,
      total: profilesWithCounts.length,
    });

  } catch (error) {
    console.error('Error fetching public profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public profiles' },
      { status: 500 }
    );
  }
}

// Helper function to check if user's journey is public
async function isJourneyPublic(userId: string): Promise<boolean> {
  const profile = await db
    .select({ isJourneyPublic: publicProfiles.isJourneyPublic })
    .from(publicProfiles)
    .where(eq(publicProfiles.userId, userId))
    .limit(1);

  return profile[0]?.isJourneyPublic || false;
}