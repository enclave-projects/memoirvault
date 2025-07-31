import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { publicProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const username = formData.get('username') as string;
    const fullName = formData.get('fullName') as string;
    const bio = formData.get('bio') as string;
    const isJourneyPublic = formData.get('isJourneyPublic') === 'true';
    const allowSpecificEntries = formData.get('allowSpecificEntries') === 'true';
    const profilePictureFile = formData.get('profilePicture') as File | null;

    // Validate required fields
    if (!username || !fullName) {
      return NextResponse.json({ 
        error: 'Username and full name are required' 
      }, { status: 400 });
    }

    // Validate username format
    if (username.length < 3 || username.length > 30 || !/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json({ 
        error: 'Invalid username format' 
      }, { status: 400 });
    }

    // Check if user already has a public profile
    const existingProfile = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.userId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json({ 
        error: 'You already have a public profile' 
      }, { status: 400 });
    }

    // Check if username is already taken
    const existingUsername = await db
      .select()
      .from(publicProfiles)
      .where(eq(publicProfiles.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json({ 
        error: 'Username is already taken' 
      }, { status: 400 });
    }

    // Handle profile picture upload
    let profilePictureUrl = null;
    if (profilePictureFile && profilePictureFile.size > 0) {
      try {
        const buffer = Buffer.from(await profilePictureFile.arrayBuffer());
        const fileExtension = profilePictureFile.name.split('.').pop();
        const fileName = `public-profiles/${userId}/profile.${fileExtension}`;
        
        profilePictureUrl = await uploadToR2(buffer, fileName, profilePictureFile.type);
      } catch (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        // Continue without profile picture if upload fails
      }
    }

    // Create public profile
    const [newProfile] = await db
      .insert(publicProfiles)
      .values({
        userId,
        username,
        fullName,
        bio: bio || null,
        profilePicture: profilePictureUrl,
        isJourneyPublic,
        allowSpecificEntries,
      })
      .returning();

    return NextResponse.json({
      success: true,
      profile: {
        id: newProfile.id,
        username: newProfile.username,
        fullName: newProfile.fullName,
        bio: newProfile.bio,
        profilePicture: newProfile.profilePicture,
        isJourneyPublic: newProfile.isJourneyPublic,
        allowSpecificEntries: newProfile.allowSpecificEntries,
      }
    });

  } catch (error) {
    console.error('Error creating public profile:', error);
    return NextResponse.json(
      { error: 'Failed to create public profile' },
      { status: 500 }
    );
  }
}