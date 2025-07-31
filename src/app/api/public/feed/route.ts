import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media, publicProfiles, userFollows, publicEntryVisibility } from '@/lib/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get users that the current user is following
        const following = await db
            .select({ followingUserId: userFollows.followingUserId })
            .from(userFollows)
            .where(eq(userFollows.followerUserId, userId));

        const followingUserIds = following.map(f => f.followingUserId);

        if (followingUserIds.length === 0) {
            return NextResponse.json({
                entries: [],
                message: 'No entries found. Follow some users to see their public entries in your feed.'
            });
        }

        // Get public entries from followed users
        const feedEntries = await db
            .select({
                entry: entries,
                profile: publicProfiles,
                media: media,
                visibility: publicEntryVisibility,
            })
            .from(entries)
            .innerJoin(publicProfiles, eq(entries.userId, publicProfiles.userId))
            .innerJoin(publicEntryVisibility, eq(entries.id, publicEntryVisibility.entryId))
            .leftJoin(media, eq(entries.id, media.entryId))
            .where(
                and(
                    inArray(entries.userId, followingUserIds),
                    eq(publicEntryVisibility.isPublic, true),
                    eq(publicProfiles.isActive, true)
                )
            )
            .orderBy(desc(entries.createdAt))
            .limit(50);

        // Group entries with their media
        const entriesMap = new Map();
        
        feedEntries.forEach(row => {
            const entryId = row.entry.id;
            
            if (!entriesMap.has(entryId)) {
                entriesMap.set(entryId, {
                    ...row.entry,
                    profile: row.profile,
                    media: []
                });
            }
            
            if (row.media) {
                entriesMap.get(entryId).media.push(row.media);
            }
        });

        const groupedEntries = Array.from(entriesMap.values());

        return NextResponse.json({
            entries: groupedEntries,
            total: groupedEntries.length
        });

    } catch (error) {
        console.error('Error fetching feed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}