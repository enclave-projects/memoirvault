import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media, publicEntryVisibility, publicProfiles } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all user entries with their visibility status and media count
        const userEntries = await db
            .select({
                id: entries.id,
                title: entries.title,
                description: entries.description,
                createdAt: entries.createdAt,
                isPublic: sql<boolean>`COALESCE(${publicEntryVisibility.isPublic}, false)`,
                mediaCount: sql<number>`COUNT(${media.id})`,
            })
            .from(entries)
            .leftJoin(publicEntryVisibility, 
                and(
                    eq(publicEntryVisibility.entryId, entries.id),
                    eq(publicEntryVisibility.userId, userId)
                )
            )
            .leftJoin(media, eq(media.entryId, entries.id))
            .where(eq(entries.userId, userId))
            .groupBy(entries.id, publicEntryVisibility.isPublic)
            .orderBy(entries.createdAt);

        return NextResponse.json({
            entries: userEntries
        });

    } catch (error) {
        console.error('Error fetching entry visibility:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { entryId, isPublic } = body;

        if (!entryId || typeof isPublic !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // Verify the entry belongs to the user
        const entry = await db
            .select()
            .from(entries)
            .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
            .limit(1);

        if (entry.length === 0) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        // Update or create visibility record
        const existingVisibility = await db
            .select()
            .from(publicEntryVisibility)
            .where(and(
                eq(publicEntryVisibility.entryId, entryId),
                eq(publicEntryVisibility.userId, userId)
            ))
            .limit(1);

        if (existingVisibility.length > 0) {
            // Update existing record
            await db
                .update(publicEntryVisibility)
                .set({
                    isPublic,
                    madePublicAt: isPublic ? new Date() : null,
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(publicEntryVisibility.entryId, entryId),
                    eq(publicEntryVisibility.userId, userId)
                ));
        } else {
            // Create new record
            await db
                .insert(publicEntryVisibility)
                .values({
                    entryId,
                    userId,
                    isPublic,
                    madePublicAt: isPublic ? new Date() : null,
                });
        }

        // Update the public entries count for the user's profile
        try {
            const publicEntriesCount = await db
                .select({ count: sql<number>`COUNT(*)` })
                .from(publicEntryVisibility)
                .where(
                    and(
                        eq(publicEntryVisibility.userId, userId),
                        eq(publicEntryVisibility.isPublic, true)
                    )
                );

            await db
                .update(publicProfiles)
                .set({
                    publicEntriesCount: publicEntriesCount[0]?.count || 0,
                    updatedAt: new Date(),
                })
                .where(eq(publicProfiles.userId, userId));
        } catch (error) {
            console.error('Error updating public entries count:', error);
            // Don't fail the whole operation if count update fails
        }

        return NextResponse.json({
            success: true,
            message: `Entry ${isPublic ? 'made public' : 'made private'} successfully`
        });

    } catch (error) {
        console.error('Error updating entry visibility:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}