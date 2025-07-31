import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, publicEntryVisibility, publicProfiles } from '@/lib/db/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { entryIds, isPublic } = body;

        if (!Array.isArray(entryIds) || entryIds.length === 0 || typeof isPublic !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // Verify all entries belong to the user
        const userEntries = await db
            .select({ id: entries.id })
            .from(entries)
            .where(and(
                inArray(entries.id, entryIds),
                eq(entries.userId, userId)
            ));

        const validEntryIds = userEntries.map(e => e.id);

        if (validEntryIds.length !== entryIds.length) {
            return NextResponse.json({ error: 'Some entries not found or unauthorized' }, { status: 403 });
        }

        // Process each entry individually (Neon HTTP doesn't support transactions)
        for (const entryId of validEntryIds) {
            try {
                // Check if visibility record exists
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
            } catch (error) {
                console.error(`Error updating entry ${entryId}:`, error);
                // Continue with other entries even if one fails
            }
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
            message: `${validEntryIds.length} entries ${isPublic ? 'made public' : 'made private'} successfully`,
            updatedCount: validEntryIds.length
        });

    } catch (error) {
        console.error('Error bulk updating entry visibility:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}