import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entries, media } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entryId = params.id;

    // Verify the entry belongs to the user
    const entry = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
      .limit(1);

    if (entry.length === 0) {
      return Response.json({ error: "Entry not found or unauthorized" }, { status: 404 });
    }

    // Get all media files associated with this entry
    const entryMedia = await db
      .select()
      .from(media)
      .where(and(eq(media.entryId, entryId), eq(media.userId, userId)));

    // Debug: Log all media files found
    console.log(`Media files found for entry ${entryId}:`, entryMedia.map(m => ({
      id: m.id,
      fileName: m.fileName,
      originalName: m.originalName,
      fileType: m.fileType,
      mimeType: m.mimeType,
      filePath: m.filePath
    })));

    // Separate files by type for debugging
    const imageFiles = entryMedia.filter(m => m.fileType === 'image');
    const videoFiles = entryMedia.filter(m => m.fileType === 'video');
    const audioFiles = entryMedia.filter(m => m.fileType === 'audio');

    console.log(`File breakdown - Images: ${imageFiles.length}, Videos: ${videoFiles.length}, Audio: ${audioFiles.length}`);

    // Delete all media files from R2 storage
    console.log(`Found ${entryMedia.length} media files to delete for entry ${entryId}`);

    const deletePromises = entryMedia.map(async (mediaItem) => {
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

    // Delete media records from database
    await db.delete(media).where(and(eq(media.entryId, entryId), eq(media.userId, userId)));

    // Delete the entry from database
    await db.delete(entries).where(and(eq(entries.id, entryId), eq(entries.userId, userId)));

    return Response.json({
      message: "Entry and associated media have been permanently deleted",
      deletedEntry: entry[0].title,
      deletedMediaFiles: entryMedia.length
    });

  } catch (error) {
    console.error("Error deleting entry:", error);
    return Response.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entryId = params.id;

    // Get the entry with its media
    const entry = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
      .limit(1);

    if (entry.length === 0) {
      return Response.json({ error: "Entry not found" }, { status: 404 });
    }

    // Get associated media
    const entryMedia = await db
      .select()
      .from(media)
      .where(and(eq(media.entryId, entryId), eq(media.userId, userId)));

    return Response.json({
      ...entry[0],
      media: entryMedia
    });

  } catch (error) {
    console.error("Error fetching entry:", error);
    return Response.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}