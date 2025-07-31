import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, sum } from "drizzle-orm";

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
      const usage = await db
        .select({ total: sum(media.fileSize) })
        .from(media)
        .where(eq(media.userId, userId));
      
      storageUsed = Number(usage[0]?.total || 0);
      console.log('Storage calculation:', { userId, storageUsed, rawTotal: usage[0]?.total });
    } catch (error) {
      console.error("Error calculating storage usage:", error);
      // Continue with default values
    }

    // Fixed 2GB storage limit for all users
    const storageLimit = 2 * 1024 * 1024 * 1024; // 2GB in bytes
    const usagePercentage = storageUsed > 0 
      ? Math.max(0.1, Math.round((storageUsed / storageLimit) * 100 * 10) / 10) // Show at least 0.1% if there's any usage
      : 0;
    
    const responseData = {
      plan: 'free',
      storageLimit,
      storageUsed,
      storageAvailable: storageLimit - storageUsed,
      usagePercentage,
      formattedUsed: formatBytes(storageUsed),
      formattedLimit: formatBytes(storageLimit),
      formattedAvailable: formatBytes(storageLimit - storageUsed),
    };
    
    console.log('Storage API response:', responseData);
    return Response.json(responseData);

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