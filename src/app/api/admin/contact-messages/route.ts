import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // In a real application, you'd want to verify admin authentication here
    // For now, we'll assume the request is authenticated since it's coming from the admin panel
    
    // Get all contact messages, ordered by newest first
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    return NextResponse.json({
      messages
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}