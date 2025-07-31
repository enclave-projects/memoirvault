import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Validate username format
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ 
        available: false, 
        message: 'Username must be between 3 and 30 characters' 
      });
    }

    // Check if username contains only allowed characters
    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json({ 
        available: false, 
        message: 'Username can only contain lowercase letters, numbers, and underscores' 
      });
    }

    // Check if username is already taken
    const existingProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.username, username))
      .limit(1);

    const available = existingProfile.length === 0;

    return NextResponse.json({ 
      available,
      message: available ? 'Username is available' : 'Username is already taken'
    });

  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { error: 'Failed to check username availability' },
      { status: 500 }
    );
  }
}