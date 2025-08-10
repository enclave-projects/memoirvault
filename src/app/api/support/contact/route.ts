import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    
    const { name, email, userId: providedUserId, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert contact message into database
    const [contactMessage] = await db.insert(contactMessages).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      userId: userId || providedUserId || null,
      subject: subject || 'General Inquiry',
      message: message.trim(),
      status: 'new'
    }).returning();

    // In a real application, you might want to:
    // 1. Send an email notification to the support team
    // 2. Send a confirmation email to the user
    // 3. Create a ticket in your support system

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
      id: contactMessage.id
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's contact messages
    const userMessages = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.userId, userId))
      .orderBy(desc(contactMessages.createdAt));

    return NextResponse.json({
      messages: userMessages
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}