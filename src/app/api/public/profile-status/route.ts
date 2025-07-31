import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has a public profile
        const profile = await db
            .select()
            .from(publicProfiles)
            .where(eq(publicProfiles.userId, userId))
            .limit(1);

        if (profile.length === 0) {
            return NextResponse.json({
                hasProfile: false,
                profileUrl: '/public/setup'
            });
        }

        return NextResponse.json({
            hasProfile: true,
            profileUrl: `/public/profile/${profile[0].username}`,
            profile: profile[0]
        });

    } catch (error) {
        console.error('Error checking profile status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}