import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, sum, sql } from "drizzle-orm";

// Get user storage information
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate storage used from media files
    let storageUsed = 0;
    try {
      // Check if media table has user_id column
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'media' AND column_name = 'user_id'
        );
      `);

      if (result.rows[0]?.exists) {
        const usage = await db
          .select({ total: sum(media.fileSize) })
          .from(media)
          .where(eq(media.userId, userId));
        
        storageUsed = Number(usage[0]?.total || 0);
      }
    } catch (error) {
      console.error("Error calculating storage usage:", error);
      // Continue with default values
    }

    // Fixed 2GB storage limit for all users
    const storageLimit = 2 * 1024 * 1024 * 1024; // 2GB in bytes
    
    return Response.json({
      plan: 'free',
      storageLimit,
      storageUsed,
      storageAvailable: storageLimit - storageUsed,
      usagePercentage: Math.round((storageUsed / storageLimit) * 100),
      formattedUsed: formatBytes(storageUsed),
      formattedLimit: formatBytes(storageLimit),
      formattedAvailable: formatBytes(storageLimit - storageUsed),
    });

  } catch (error) {
    console.error("Error fetching user storage:", error);
    // Return default values for any error
    const storageLimit = 2 * 1024 * 1024 * 1024; // 2GB
    return Response.json({
      plan: 'free',
      storageLimit,
      storageUsed: 0,
      storageAvailable: storageLimit,
      usagePercentage: 0,
      formattedUsed: '0 Bytes',
      formattedLimit: '2 GB',
      formattedAvailable: '2 GB',
    });
  }
}

// Format bytes to human readable format
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}