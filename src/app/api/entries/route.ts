import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media } from '@/lib/db/schema';
import { uploadToR2 } from '@/lib/r2';
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

        // Create entry
        const [entry] = await db.insert(entries).values({
            userId,
            title,
            description,
        }).returning();

        // Upload files and create media records
        const mediaRecords = [];
        
        for (const file of files) {
            if (file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileExtension = file.name.split('.').pop();
                const fileName = `${entry.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
                
                try {
                    // Upload to R2
                    const publicUrl = await uploadToR2(buffer, fileName, file.type);

                    // Determine file type
                    let fileType = 'other';
                    if (file.type.startsWith('image/')) fileType = 'image';
                    else if (file.type.startsWith('video/')) fileType = 'video';
                    else if (file.type.startsWith('audio/')) fileType = 'audio';

                    // Create media record
                    const [mediaRecord] = await db.insert(media).values({
                        entryId: entry.id,
                        fileName,
                        originalName: file.name,
                        fileType,
                        mimeType: file.type,
                        fileSize: file.size,
                        r2Key: fileName,
                        publicUrl,
                    }).returning();

                    mediaRecords.push(mediaRecord);
                } catch (uploadError) {
                    console.error(`Failed to upload file ${file.name}:`, uploadError);
                    // Continue with other files even if one fails
                }
            }
        }

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