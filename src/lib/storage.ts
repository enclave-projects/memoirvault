import { db } from '@/lib/db';
import { userStorage, media } from '@/lib/db/schema';
import { eq, sum } from 'drizzle-orm';
import { formatFileSize } from '@/lib/utils';

// Storage limits in bytes
export const STORAGE_LIMITS = {
  free: 2 * 1024 * 1024 * 1024,      // 2GB
  basic: 30 * 1024 * 1024 * 1024,    // 30GB
  pro: 50 * 1024 * 1024 * 1024,      // 50GB
};

export type PlanType = 'free' | 'basic' | 'pro';

export interface StorageCheckResult {
  canUpload: boolean;
  reason?: string;
  currentUsage: number;
  limit: number;
  available: number;
}

// Initialize user storage record for new users
export async function initializeUserStorage(userId: string, plan: PlanType = 'free') {
  try {
    // Check if user storage record exists
    const existing = await db
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      // Create storage record with specified plan
      await db.insert(userStorage).values({
        userId,
        plan,
        storageLimit: STORAGE_LIMITS[plan],
        storageUsed: 0,
      });
    }
  } catch (error) {
    console.error('Error initializing user storage:', error);
    throw error;
  }
}

// Check if user can upload a file of given size
export async function canUploadFile(userId: string, fileSize: number): Promise<StorageCheckResult> {
  try {
    // Get user storage info
    const storage = await db
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, userId))
      .limit(1);

    if (storage.length === 0) {
      // Initialize storage if not exists
      await initializeUserStorage(userId);
      return canUploadFile(userId, fileSize); // Retry after initialization
    }

    const userStorageInfo = storage[0];
    const available = userStorageInfo.storageLimit - userStorageInfo.storageUsed;

    if (fileSize > available) {
      return {
        canUpload: false,
        reason: `File size (${formatFileSize(fileSize)}) exceeds available storage (${formatFileSize(available)}). Please upgrade your plan or delete some files.`,
        currentUsage: userStorageInfo.storageUsed,
        limit: userStorageInfo.storageLimit,
        available,
      };
    }

    return {
      canUpload: true,
      currentUsage: userStorageInfo.storageUsed,
      limit: userStorageInfo.storageLimit,
      available,
    };
  } catch (error) {
    console.error('Error checking storage limits:', error);
    throw error;
  }
}

// Update user storage usage by calculating actual usage from media files
export async function updateStorageUsage(userId: string) {
  try {
    // Calculate actual storage used from media files
    const result = await db
      .select({ total: sum(media.fileSize) })
      .from(media)
      .where(eq(media.userId, userId));

    const actualUsage = Number(result[0]?.total || 0);

    // Update storage record
    await db
      .update(userStorage)
      .set({
        storageUsed: actualUsage,
        lastUpdated: new Date(),
      })
      .where(eq(userStorage.userId, userId));

    return actualUsage;
  } catch (error) {
    console.error('Error updating storage usage:', error);
    throw error;
  }
}

// Update user storage plan and limits
export async function updateUserPlan(userId: string, plan: PlanType) {
  try {
    if (!STORAGE_LIMITS[plan]) {
      throw new Error(`Invalid plan: ${plan}`);
    }

    // Update user storage plan and limit
    const updated = await db
      .update(userStorage)
      .set({
        plan,
        storageLimit: STORAGE_LIMITS[plan],
        lastUpdated: new Date(),
      })
      .where(eq(userStorage.userId, userId))
      .returning();

    if (updated.length === 0) {
      // Create storage record if it doesn't exist
      await db.insert(userStorage).values({
        userId,
        plan,
        storageLimit: STORAGE_LIMITS[plan],
        storageUsed: 0,
      });
    }

    return updated[0] || null;
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
}

// Get user storage information
export async function getUserStorage(userId: string) {
  try {
    const storage = await db
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, userId))
      .limit(1);

    if (storage.length === 0) {
      // Initialize storage if not exists
      await initializeUserStorage(userId);
      return getUserStorage(userId); // Retry after initialization
    }

    const userStorageInfo = storage[0];
    
    // Calculate actual usage and update if different
    const actualUsage = await updateStorageUsage(userId);
    
    return {
      ...userStorageInfo,
      storageUsed: actualUsage,
      storageAvailable: userStorageInfo.storageLimit - actualUsage,
      usagePercentage: Math.round((actualUsage / userStorageInfo.storageLimit) * 100),
    };
  } catch (error) {
    console.error('Error getting user storage:', error);
    throw error;
  }
}

// Check if user is approaching storage limit
export function isApproachingLimit(usagePercentage: number): boolean {
  return usagePercentage >= 90;
}

// Check if user has exceeded storage limit
export function hasExceededLimit(usagePercentage: number): boolean {
  return usagePercentage >= 100;
}