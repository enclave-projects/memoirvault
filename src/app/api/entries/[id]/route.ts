import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { entries, media } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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

    // Delete all media files from R2 storage
    const deletePromises = entryMedia.map(async (mediaItem) => {
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