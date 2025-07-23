import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entries, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all user entries with their media
    const userEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId));

    // Get all media files for deletion from storage
    const allMedia = await db
      .select()
      .from(media)
      .where(eq(media.userId, userId));

    // Delete all media files from R2 storage
    const deletePromises = allMedia.map(async (mediaItem) => {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          Key: mediaItem.filePath,
        });
        await r2Client.send(deleteCommand);
      } catch (error) {
        console.error(`Failed to delete file ${mediaItem.filePath}:`, error);
        // Continue with other deletions even if one fails
      }
    });

    await Promise.allSettled(deletePromises);

    // Delete all media records from database
    await db.delete(media).where(eq(media.userId, userId));

    // Delete all entries from database
    await db.delete(entries).where(eq(entries.userId, userId));

    return Response.json({ 
      message: "All user data has been permanently deleted",
      deletedEntries: userEntries.length,
      deletedMediaFiles: allMedia.length
    });

  } catch (error) {
    console.error("Error clearing user data:", error);
    return Response.json(
      { error: "Failed to clear user data" },
      { status: 500 }
    );
  }
}