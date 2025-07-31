import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, bio, isJourneyPublic, allowSpecificEntries, isActive } = body;

        // Validate required fields
        if (!fullName || fullName.trim().length === 0) {
            return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        // Update the public profile
        const updatedProfile = await db
            .update(publicProfiles)
            .set({
                fullName: fullName.trim(),
                bio: bio?.trim() || null,
                isJourneyPublic: Boolean(isJourneyPublic),
                allowSpecificEntries: Boolean(allowSpecificEntries),
                isActive: Boolean(isActive),
                updatedAt: new Date(),
            })
            .where(eq(publicProfiles.userId, userId))
            .returning();

        if (updatedProfile.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            profile: updatedProfile[0]
        });

    } catch (error) {
        console.error('Error updating public profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}