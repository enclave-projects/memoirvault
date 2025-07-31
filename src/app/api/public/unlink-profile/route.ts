import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update the public profile to inactive
        const updatedProfile = await db
            .update(publicProfiles)
            .set({
                isActive: false,
                updatedAt: new Date(),
            })
            .where(eq(publicProfiles.userId, userId))
            .returning();

        if (updatedProfile.length === 0) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile unlinked successfully',
            profile: updatedProfile[0]
        });

    } catch (error) {
        console.error('Error unlinking public profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}