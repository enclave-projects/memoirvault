import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media } from '@/lib/db/schema';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';
import { eq, desc, sql } from 'drizzle-orm';
import { formatFileSize } from '@/lib/utils';
import { updateStorageUsage, initializeUserStorage } from '@/lib/storage';

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

        // Initialize user storage if not exists
        await initializeUserStorage(userId);

        // Check storage limits for all files
        const totalFileSize = files.reduce((total, file) => total + file.size, 0);
        if (totalFileSize > 0) {
            // Calculate current storage usage
            let currentUsage = 0;
            try {
                const result = await db.execute(sql`
                    SELECT SUM(file_size) as total
                    FROM media
                    WHERE user_id = ${userId}
                `);
                currentUsage = Number(result.rows[0]?.total || 0);
            } catch (error) {
                console.error('Error calculating storage usage:', error);
            }
            
            // Fixed 2GB storage limit
            const storageLimit = 2 * 1024 * 1024 * 1024; // 2GB
            const availableStorage = storageLimit - currentUsage;
            
            if (totalFileSize > availableStorage) {
                return NextResponse.json({ 
                    error: 'Storage limit exceeded', 
                    message: `File size (${formatFileSize(totalFileSize)}) exceeds available space (${formatFileSize(availableStorage)})` 
                }, { status: 413 });
            }
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
                    
                    console.log(`🔧 Processing file: ${file.name}, extension: ${fileExtension}, generated fileName: ${fileName}`);
                    
                    try {
                        // Upload to R2
                        const publicUrl = await uploadToR2(buffer, fileName, file.type);
                        uploadedFiles.push(fileName); // Track for potential cleanup
    
                        // Determine file type
                        let fileType = 'other';
                        if (file.type.startsWith('image/')) fileType = 'image';
                        else if (file.type.startsWith('video/')) fileType = 'video';
                        else if (file.type.startsWith('audio/')) fileType = 'audio';
    
                        console.log(`📁 Uploading file: ${file.name}, type: ${fileType}, mimeType: ${file.type}, fileName: ${fileName}`);
    
                        // Create media record
                        const [mediaRecord] = await db.insert(media).values({
                            entryId: entry.id,
                            userId, // Add userId for easier querying
                            fileName,
                            originalName: file.name,
                            fileType,
                            mimeType: file.type,
                            fileSize: file.size,
                            filePath: fileName, // Use filePath instead of r2Key
                            publicUrl,
                        }).returning();

                        console.log(`💾 Stored media record: ${mediaRecord.id}, filePath: ${mediaRecord.filePath}, fileType: ${mediaRecord.fileType}`);
    
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

        // Update user storage usage after successful upload
        await updateStorageUsage(userId);

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

        // Check if media table has user_id column
        let hasUserIdColumn = true;
        try {
            await db.select().from(media).limit(1);
        } catch (error) {
            // If error contains "column user_id does not exist", set hasUserIdColumn to false
            if (error.message && error.message.includes("column \"user_id\" does not exist")) {
                hasUserIdColumn = false;
            }
        }

        // Get media for each entry
        const entriesWithMedia = await Promise.all(
            userEntries.map(async (entry) => {
                let entryMedia = [];
                try {
                    if (hasUserIdColumn) {
                        entryMedia = await db
                            .select({
                                id: media.id,
                                entryId: media.entryId,
                                fileName: media.fileName,
                                originalName: media.originalName,
                                fileType: media.fileType,
                                mimeType: media.mimeType,
                                fileSize: media.fileSize,
                                publicUrl: media.publicUrl,
                                metadata: media.metadata,
                                createdAt: media.createdAt
                            })
                            .from(media)
                            .where(eq(media.entryId, entry.id));
                    } else {
                        // If user_id column doesn't exist, use a raw query
                        const result = await db.execute(sql`
                            SELECT id, entry_id, file_name, original_name, file_type, 
                                   mime_type, file_size, public_url, metadata, created_at
                            FROM media
                            WHERE entry_id = ${entry.id}
                        `);
                        
                        entryMedia = result.rows.map(row => ({
                            id: row.id,
                            entryId: row.entry_id,
                            fileName: row.file_name,
                            originalName: row.original_name,
                            fileType: row.file_type,
                            mimeType: row.mime_type,
                            fileSize: row.file_size,
                            publicUrl: row.public_url,
                            metadata: row.metadata,
                            createdAt: row.created_at
                        }));
                    }
                } catch (error) {
                    console.error(`Error fetching media for entry ${entry.id}:`, error);
                    // Return empty media array on error
                    entryMedia = [];
                }

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