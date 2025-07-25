import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entries, media } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { deleteFromR2 } from "@/lib/r2";

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

    // Debug: Log all media files found
    console.log(`All media files found for user ${userId}:`, allMedia.map(m => ({
      id: m.id,
      fileName: m.fileName,
      originalName: m.originalName,
      fileType: m.fileType,
      mimeType: m.mimeType,
      filePath: m.filePath
    })));

    // Separate files by type for debugging
    const imageFiles = allMedia.filter(m => m.fileType === 'image');
    const videoFiles = allMedia.filter(m => m.fileType === 'video');
    const audioFiles = allMedia.filter(m => m.fileType === 'audio');
    const otherFiles = allMedia.filter(m => m.fileType === 'other');
    
    console.log(`File breakdown - Images: ${imageFiles.length}, Videos: ${videoFiles.length}, Audio: ${audioFiles.length}, Other: ${otherFiles.length}`);

    // Delete all media files from R2 storage
    const deletePromises = allMedia.map(async (mediaItem) => {
      try {
        console.log(`Attempting to delete file from R2: ${mediaItem.filePath}`);
        await deleteFromR2(mediaItem.filePath);
        console.log(`Successfully deleted file from R2: ${mediaItem.filePath}`);
        return { success: true, filePath: mediaItem.filePath };
      } catch (error) {
        console.error(`Failed to delete file ${mediaItem.filePath} from R2:`, error);
        return { success: false, filePath: mediaItem.filePath, error: error.message };
      }
    });

    const deleteResults = await Promise.allSettled(deletePromises);
    
    // Log results for debugging
    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { success, filePath, error } = result.value;
        if (success) {
          console.log(`✅ Successfully deleted: ${filePath}`);
        } else {
          console.log(`❌ Failed to delete: ${filePath} - ${error}`);
        }
      } else {
        console.log(`❌ Promise rejected for file ${index}:`, result.reason);
      }
    });

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