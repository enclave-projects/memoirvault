import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userFollows, publicProfiles } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
      return NextResponse.json({ 
        error: 'Target user ID is required' 
      }, { status: 400 });
    }

    if (userId === targetUserId) {
      return NextResponse.json({ 
        isFollowing: false,
        message: 'Cannot follow yourself'
      });
    }

    // Check if current user has a public profile
    const currentUserProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, userId))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ 
        isFollowing: false,
        message: 'You need a public profile to follow other users'
      });
    }

    // Check if target user has a public profile
    const targetProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, targetUserId))
      .limit(1);

    if (targetProfile.length === 0) {
      return NextResponse.json({ 
        isFollowing: false,
        message: 'Target user does not have a public profile'
      });
    }

    // Check if following relationship exists
    const followRelationship = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerUserId, userId),
          eq(userFollows.followingUserId, targetUserId)
        )
      )
      .limit(1);

    console.log(`Follow status check: ${userId} -> ${targetUserId}, found: ${followRelationship.length > 0}`);

    return NextResponse.json({
      isFollowing: followRelationship.length > 0,
      canFollow: true,
      debug: {
        currentUserId: userId,
        targetUserId: targetUserId,
        relationshipFound: followRelationship.length > 0,
        relationshipCount: followRelationship.length
      }
    });

  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    );
  }
}