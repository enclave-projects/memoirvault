import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userFollows, publicProfiles } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, action } = await request.json();

    if (!targetUserId || !action) {
      return NextResponse.json({ 
        error: 'Target user ID and action are required' 
      }, { status: 400 });
    }

    if (action !== 'follow' && action !== 'unfollow') {
      return NextResponse.json({ 
        error: 'Action must be either "follow" or "unfollow"' 
      }, { status: 400 });
    }

    if (userId === targetUserId) {
      return NextResponse.json({ 
        error: 'You cannot follow yourself' 
      }, { status: 400 });
    }

    // Check if target user has a public profile
    const targetProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, targetUserId))
      .limit(1);

    if (targetProfile.length === 0) {
      return NextResponse.json({ 
        error: 'Target user does not have a public profile' 
      }, { status: 404 });
    }

    // Check if current user has a public profile
    const currentUserProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, userId))
      .limit(1);

    if (currentUserProfile.length === 0) {
      return NextResponse.json({ 
        error: 'You need a public profile to follow other users' 
      }, { status: 400 });
    }

    if (action === 'follow') {
      // Check if already following
      const existingFollow = await db
        .select()
        .from(userFollows)
        .where(
          and(
            eq(userFollows.followerUserId, userId),
            eq(userFollows.followingUserId, targetUserId)
          )
        )
        .limit(1);

      if (existingFollow.length > 0) {
        return NextResponse.json({ 
          error: 'You are already following this user' 
        }, { status: 400 });
      }

      // Create follow relationship
      await db.insert(userFollows).values({
        followerUserId: userId,
        followingUserId: targetUserId,
      });

      // Recalculate actual follower count for target user
      const actualFollowersCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userFollows)
        .where(eq(userFollows.followingUserId, targetUserId));

      await db
        .update(publicProfiles)
        .set({ 
          followersCount: actualFollowersCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(publicProfiles.userId, targetUserId));

      // Recalculate actual following count for current user
      const actualFollowingCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userFollows)
        .where(eq(userFollows.followerUserId, userId));

      await db
        .update(publicProfiles)
        .set({ 
          followingCount: actualFollowingCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(publicProfiles.userId, userId));

      return NextResponse.json({ 
        success: true, 
        action: 'followed',
        message: `You are now following ${targetProfile[0].fullName}`
      });

    } else { // unfollow
      // Check if currently following
      const existingFollow = await db
        .select()
        .from(userFollows)
        .where(
          and(
            eq(userFollows.followerUserId, userId),
            eq(userFollows.followingUserId, targetUserId)
          )
        )
        .limit(1);

      if (existingFollow.length === 0) {
        return NextResponse.json({ 
          error: 'You are not following this user' 
        }, { status: 400 });
      }

      // Remove follow relationship
      await db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerUserId, userId),
            eq(userFollows.followingUserId, targetUserId)
          )
        );

      // Recalculate actual follower count for target user
      const actualFollowersCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userFollows)
        .where(eq(userFollows.followingUserId, targetUserId));

      await db
        .update(publicProfiles)
        .set({ 
          followersCount: actualFollowersCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(publicProfiles.userId, targetUserId));

      // Recalculate actual following count for current user
      const actualFollowingCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userFollows)
        .where(eq(userFollows.followerUserId, userId));

      await db
        .update(publicProfiles)
        .set({ 
          followingCount: actualFollowingCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(publicProfiles.userId, userId));

      return NextResponse.json({ 
        success: true, 
        action: 'unfollowed',
        message: `You have unfollowed ${targetProfile[0].fullName}`
      });
    }

  } catch (error) {
    console.error('Error handling follow/unfollow:', error);
    return NextResponse.json(
      { error: 'Failed to process follow/unfollow request' },
      { status: 500 }
    );
  }
}