import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { helpArticles } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id;

    // Increment helpful count and view count
    await db
      .update(helpArticles)
      .set({
        helpfulCount: sql`${helpArticles.helpfulCount} + 1`,
        viewCount: sql`${helpArticles.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(helpArticles.id, articleId));

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    console.error('Error marking article as helpful:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}