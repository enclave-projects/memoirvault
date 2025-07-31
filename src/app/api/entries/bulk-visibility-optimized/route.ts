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

        // Verify all entries belong to the user in a single query
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

        // Use UPSERT (INSERT ... ON CONFLICT) for better performance
        const upsertQuery = sql`
            INSERT INTO ${publicEntryVisibility} (entry_id, user_id, is_public, made_public_at, created_at, updated_at)
            SELECT 
                unnest(${validEntryIds}::uuid[]) as entry_id,
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
        `;

        // Execute upsert and count update in parallel
        const [_, countResult] = await Promise.all([
            db.execute(upsertQuery),
            db.select({ count: sql<number>`COUNT(*)` })
                .from(publicEntryVisibility)
                .where(and(
                    eq(publicEntryVisibility.userId, userId),
                    eq(publicEntryVisibility.isPublic, true)
                ))
        ]);

        // Update profile count
        await db
            .update(publicProfiles)
            .set({
                publicEntriesCount: countResult[0]?.count || 0,
                updatedAt: new Date(),
            })
            .where(eq(publicProfiles.userId, userId));

        return NextResponse.json({
            success: true,
            message: `${validEntryIds.length} entries ${isPublic ? 'made public' : 'made private'} successfully`,
            updatedCount: validEntryIds.length,
            newPublicCount: countResult[0]?.count || 0
        });

    } catch (error) {
        console.error('Error bulk updating entry visibility:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}