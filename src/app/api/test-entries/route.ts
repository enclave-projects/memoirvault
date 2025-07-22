import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create entry without file upload for now
    const [entry] = await db.insert(entries).values({
      userId,
      title,
      description,
    }).returning();

    // For now, just return the entry without uploading files
    const mediaRecords = files.map((file, index) => ({
      id: `temp-${index}`,
      entryId: entry.id,
      fileName: file.name,
      originalName: file.name,
      fileType: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 
                file.type.startsWith('audio/') ? 'audio' : 'other',
      mimeType: file.type,
      fileSize: file.size,
      r2Key: `temp-${file.name}`,
      publicUrl: '/placeholder-image.jpg',
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({ 
      entry, 
      media: mediaRecords 
    });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .orderBy(desc(entries.createdAt));

    // Get media for each entry
    const entriesWithMedia = await Promise.all(
      userEntries.map(async (entry) => {
        const entryMedia = await db
          .select()
          .from(media)
          .where(eq(media.entryId, entry.id));
        
        return {
          ...entry,
          media: entryMedia,
        };
      })
    );

    return NextResponse.json(entriesWithMedia);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}