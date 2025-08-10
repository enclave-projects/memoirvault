import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communityPosts } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get all approved community posts
    const posts = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.isApproved, true))
      .orderBy(desc(communityPosts.createdAt));

    return NextResponse.json({
      posts
    });

  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    
    const { 
      title, 
      description, 
      imageUrl, 
      videoUrl, 
      authorName, 
      authorEmail, 
      isExistingUser 
    } = body;

    // Validate required fields
    if (!title || !description || !authorName) {
      return NextResponse.json(
        { error: 'Title, description, and author name are required' },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    if (imageUrl && !isValidUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    if (videoUrl && !isValidUrl(videoUrl)) {
      return NextResponse.json(
        { error: 'Invalid video URL format' },
        { status: 400 }
      );
    }

    // Create new community post
    const [post] = await db.insert(communityPosts).values({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim() || null,
      isExistingUser: !!userId,
      userId: userId || null,
      isApproved: true, // Auto-approve for now
      likesCount: 0,
      repliesCount: 0
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Post created successfully!',
      post
    });

  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json(
      { error: 'Failed to create post. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}