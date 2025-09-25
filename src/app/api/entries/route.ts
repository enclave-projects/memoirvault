import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { entries, media } from '@/lib/db/schema';
import { deleteFromR2 } from '@/lib/r2';
import { eq, desc, sql } from 'drizzle-orm';
import { formatFileSize } from '@/lib/utils';
import { updateStorageUsage, initializeUserStorage } from '@/lib/storage';

const recentSubmissions = new Map<string, { userId: string, timestamp: number }>();

setInterval(() => {
    const now = Date.now();
    for (const [id, data] of recentSubmissions.entries()) {
        if (now - data.timestamp > 10 * 60 * 1000) {
            recentSubmissions.delete(id);
        }
    }
}, 10 * 60 * 1000);

const PUBLIC_R2_BASE_URL = process.env.PUBLIC_R2_URL ?? process.env.PUBLIC_DEVELOPMENT_URL ?? '';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json().catch(() => null) as RequestPayload | null;
        if (!body) {
            return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
        }

        const { title, description, submissionId, files } = body;

        if (!isNonEmptyString(title)) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const sanitizedFiles = sanitizeFiles(files, userId);
        if (sanitizedFiles.invalid.length > 0) {
            return NextResponse.json({
                error: 'Invalid file metadata provided',
                details: sanitizedFiles.invalid,
            }, { status: 400 });
        }

        await initializeUserStorage(userId);

        const totalFileSize = sanitizedFiles.valid.reduce((total, file) => total + file.size, 0);
        if (totalFileSize > 0) {
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

            const storageLimit = 2 * 1024 * 1024 * 1024; // 2GB
            const availableStorage = storageLimit - currentUsage;

            if (totalFileSize > availableStorage) {
                return NextResponse.json({
                    error: 'Storage limit exceeded',
                    message: `File size (${formatFileSize(totalFileSize)}) exceeds available space (${formatFileSize(availableStorage)})`
                }, { status: 413 });
            }
        }

        if (isNonEmptyString(submissionId)) {
            const existingSubmission = recentSubmissions.get(submissionId);
            if (existingSubmission && existingSubmission.userId === userId) {
                return NextResponse.json({ error: 'Duplicate submission detected' }, { status: 409 });
            }

            recentSubmissions.set(submissionId, {
                userId,
                timestamp: Date.now()
            });
        }

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
            return NextResponse.json({ error: 'A similar entry was just created. Please wait a moment before creating another.' }, { status: 409 });
        }

        const [entry] = await db.insert(entries).values({
            userId,
            title,
            description,
        }).returning();

        const mediaRecords = [];

        try {
            for (const file of sanitizedFiles.valid) {
                const fileType = determineFileType(file.mimeType);

                const [mediaRecord] = await db.insert(media).values({
                    entryId: entry.id,
                    userId,
                    fileName: file.fileKey,
                    originalName: file.originalName,
                    fileType,
                    mimeType: file.mimeType,
                    fileSize: file.size,
                    filePath: file.fileKey,
                    publicUrl: file.publicUrl,
                    metadata: file.metadata,
                }).returning();

                mediaRecords.push(mediaRecord);
            }
        } catch (error) {
            console.error('Error while saving media metadata:', error);

            if (entry && entry.id) {
                try {
                    await db.delete(entries).where(eq(entries.id, entry.id));

                    await Promise.all(sanitizedFiles.valid.map(async (file) => {
                        try {
                            await deleteFromR2(file.fileKey);
                        } catch (deleteError) {
                            console.error(`Failed to delete R2 object ${file.fileKey} during rollback:`, deleteError);
                        }
                    }));
                } catch (cleanupError) {
                    console.error('Failed to clean up after metadata error:', cleanupError);
                }
            }

            throw error;
        }

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

interface RequestPayload {
    title: string;
    description?: string;
    submissionId?: string;
    files?: IncomingFile[];
}

interface IncomingFile {
    fileKey?: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    publicUrl?: string;
    metadata?: unknown;
}

interface SanitizedFile {
    fileKey: string;
    originalName: string;
    mimeType: string;
    size: number;
    publicUrl: string;
    metadata?: unknown;
}

interface SanitizedResult {
    valid: SanitizedFile[];
    invalid: string[];
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function sanitizeFiles(files: IncomingFile[] | undefined, userId: string): SanitizedResult {
    if (!Array.isArray(files) || files.length === 0) {
        return { valid: [], invalid: [] };
    }

    const invalid: string[] = [];
    const valid: SanitizedFile[] = [];

    files.forEach((raw, index) => {
        if (!raw || !isNonEmptyString(raw.fileKey)) {
            invalid.push(`files[${index}] is missing a valid fileKey`);
            return;
        }

        if (!raw.fileKey.startsWith(`${userId}/`)) {
            invalid.push(`files[${index}] has an unexpected key prefix`);
            return;
        }

        const size = typeof raw.size === 'number' && Number.isFinite(raw.size) && raw.size >= 0 ? raw.size : 0;
        const mimeType = isNonEmptyString(raw.mimeType) ? raw.mimeType : 'application/octet-stream';
        const originalName = isNonEmptyString(raw.originalName)
            ? raw.originalName
            : (raw.fileKey.split('/').pop() ?? raw.fileKey);

        const providedPublicUrl = isNonEmptyString(raw.publicUrl) ? raw.publicUrl : null;
        const fallbackPublicUrl = isNonEmptyString(PUBLIC_R2_BASE_URL) ? `${PUBLIC_R2_BASE_URL}/${raw.fileKey}` : null;
        const publicUrl = providedPublicUrl ?? fallbackPublicUrl;

        if (!isNonEmptyString(publicUrl)) {
            invalid.push(`files[${index}] is missing publicUrl and no PUBLIC_R2_URL is configured`);
            return;
        }

        const metadata = typeof raw.metadata === 'object' && raw.metadata !== null ? raw.metadata : undefined;

        valid.push({
            fileKey: raw.fileKey,
            originalName,
            mimeType,
            size,
            publicUrl,
            metadata,
        });
    });

    return { valid, invalid };
}

function determineFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'other';
}