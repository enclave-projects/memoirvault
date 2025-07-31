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

    const { direction } = await request.json();

    if (direction !== 'to-private' && direction !== 'to-public') {
      return NextResponse.json({ 
        error: 'Invalid direction. Must be "to-private" or "to-public"' 
      }, { status: 400 });
    }

    // Check if user has a public profile
    const profile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, userId))
      .limit(1);

    if (direction === 'to-public' && profile.length === 0) {
      return NextResponse.json({ 
        error: 'No public profile found. Please create one first.',
        redirectTo: '/public/setup'
      }, { status: 404 });
    }

    if (direction === 'to-private' && profile.length === 0) {
      return NextResponse.json({ 
        error: 'No public profile found.',
        redirectTo: '/dashboard'
      }, { status: 404 });
    }

    // Return appropriate redirect information
    if (direction === 'to-public') {
      return NextResponse.json({
        success: true,
        redirectTo: `/public/profile/${profile[0].username}`,
        profile: {
          username: profile[0].username,
          fullName: profile[0].fullName,
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        redirectTo: '/dashboard',
        message: 'Switching to private platform...'
      });
    }

  } catch (error) {
    console.error('Error switching platform:', error);
    return NextResponse.json(
      { error: 'Failed to switch platform' },
      { status: 500 }
    );
  }
}