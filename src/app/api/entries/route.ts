import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media } from '@/lib/db/schema';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';
import { eq, desc } from 'drizzle-orm';

// Create a Map to store recent submissions to prevent duplicates
const recentSubmissions = new Map<string, { userId: string, timestamp: number }>();

// Clean up old submissions every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [id, data] of recentSubmissions.entries()) {
        // Remove entries older than 10 minutes
        if (now - data.timestamp > 10 * 60 * 1000) {
            recentSubmissions.delete(id);
        }
    }
}, 10 * 60 * 1000);

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const submissionId = formData.get('submissionId') as string;
        const files = formData.getAll('files') as File[];

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        
        // Check for duplicate submission
        if (submissionId) {
            const existingSubmission = recentSubmissions.get(submissionId);
            if (existingSubmission && existingSubmission.userId === userId) {
                console.log(`Detected duplicate submission: ${submissionId}`);
                return NextResponse.json({ error: 'Duplicate submission detected' }, { status: 409 });
            }
            
            // Store this submission to prevent duplicates
            recentSubmissions.set(submissionId, { 
                userId, 
                timestamp: Date.now() 
            });
        }
        
        // Check for recent identical submissions (within last 30 seconds)
        const recentEntries = await db
            .select()
            .from(entries)
            .where(eq(entries.userId, userId))
            .orderBy(desc(entries.createdAt))
            .limit(5);
            
        const now = new Date();
        const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
        
        const duplicateEntry = recentEntries.find(entry => 
            entry.title === title && 
            entry.description === description &&
            new Date(entry.createdAt) > thirtySecondsAgo
        );
        
        if (duplicateEntry) {
            console.log(`Detected duplicate entry with title "${title}" created within last 30 seconds`);
            return NextResponse.json({ error: 'A similar entry was just created. Please wait a moment before creating another.' }, { status: 409 });
        }

        // Create entry
        const [entry] = await db.insert(entries).values({
            userId,
            title,
            description,
        }).returning();

        // Upload files and create media records
        const mediaRecords = [];
        const uploadedFiles = []; // Track successfully uploaded files for cleanup in case of error
        
        try {
            for (const file of files) {
                if (file.size > 0) {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const fileExtension = file.name.split('.').pop();
                    // Use a more consistent naming pattern
                    const fileName = `${entry.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
                    
                    try {
                        // Upload to R2
                        const publicUrl = await uploadToR2(buffer, fileName, file.type);
                        uploadedFiles.push(fileName); // Track for potential cleanup
    
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
        } catch (error) {
            console.error('Error during file processing:', error);
            
            // If we have an error after creating the entry but before completing all uploads,
            // clean up by deleting the entry and any uploaded files
            if (entry && entry.id) {
                try {
                    // Delete the entry (cascade will delete media records)
                    await db.delete(entries).where(eq(entries.id, entry.id));
                    
                    // Delete uploaded files from R2
                    for (const fileName of uploadedFiles) {
                        try {
                            await deleteFromR2(fileName);
                            console.log(`Cleaned up file ${fileName} after error`);
                        } catch (deleteError) {
                            console.error(`Failed to delete file ${fileName}:`, deleteError);
                        }
                    }
                } catch (cleanupError) {
                    console.error('Failed to clean up after error:', cleanupError);
                }
            }
            
            throw error; // Re-throw to be caught by the outer try/catch
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

export async function GET() {
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