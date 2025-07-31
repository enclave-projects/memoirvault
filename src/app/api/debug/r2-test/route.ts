import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { r2Client } from "@/lib/r2";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all media files for this user from database
    const userMedia = await db
      .select()
      .from(media)
      .where(eq(media.userId, userId));

    console.log(`Found ${userMedia.length} media files in database for user ${userId}`);

    // Check which files actually exist in R2
    const r2CheckResults = await Promise.all(
      userMedia.map(async (mediaItem) => {
        try {
          const headCommand = new HeadObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: mediaItem.filePath,
          });
          const headResult = await r2Client.send(headCommand);
          return {
            filePath: mediaItem.filePath,
            fileType: mediaItem.fileType,
            originalName: mediaItem.originalName,
            existsInR2: true,
            size: headResult.ContentLength,
            contentType: headResult.ContentType,
            lastModified: headResult.LastModified
          };
        } catch (error) {
          return {
            filePath: mediaItem.filePath,
            fileType: mediaItem.fileType,
            originalName: mediaItem.originalName,
            existsInR2: false,
            error: error.name || error.message
          };
        }
      })
    );

    // Separate by file type
    const imageFiles = r2CheckResults.filter(f => f.fileType === 'image');
    const videoFiles = r2CheckResults.filter(f => f.fileType === 'video');
    const audioFiles = r2CheckResults.filter(f => f.fileType === 'audio');

    // Count existing vs missing files
    const existingFiles = r2CheckResults.filter(f => f.existsInR2);
    const missingFiles = r2CheckResults.filter(f => !f.existsInR2);

    return Response.json({
      summary: {
        totalInDatabase: userMedia.length,
        existingInR2: existingFiles.length,
        missingInR2: missingFiles.length,
        byType: {
          images: {
            total: imageFiles.length,
            existing: imageFiles.filter(f => f.existsInR2).length,
            missing: imageFiles.filter(f => !f.existsInR2).length
          },
          videos: {
            total: videoFiles.length,
            existing: videoFiles.filter(f => f.existsInR2).length,
            missing: videoFiles.filter(f => !f.existsInR2).length
          },
          audio: {
            total: audioFiles.length,
            existing: audioFiles.filter(f => f.existsInR2).length,
            missing: audioFiles.filter(f => !f.existsInR2).length
          }
        }
      },
      files: r2CheckResults,
      missingFiles: missingFiles.length > 0 ? missingFiles : undefined
    });

  } catch (error) {
    console.error("Error in R2 test:", error);
    return Response.json(
      { error: "Failed to test R2 storage" },
      { status: 500 }
    );
  }
}