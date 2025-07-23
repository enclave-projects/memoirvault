import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { userStorage } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Storage limits in bytes
const STORAGE_LIMITS = {
  free: 2 * 1024 * 1024 * 1024,      // 2GB
  basic: 30 * 1024 * 1024 * 1024,    // 30GB
  pro: 50 * 1024 * 1024 * 1024,      // 50GB
};

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.redirect(new URL('/sign-in', request.url));
    }

    // Get the plan from the query string
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan');

    if (!plan || !['free', 'basic', 'pro'].includes(plan)) {
      return Response.redirect(new URL('/pricing', request.url));
    }

    // Update user storage plan
    const storage = await db
      .select()
      .from(userStorage)
      .where(eq(userStorage.userId, userId))
      .limit(1);

    if (storage.length === 0) {
      // Create storage record if it doesn't exist
      await db.insert(userStorage).values({
        userId,
        plan,
        storageLimit: STORAGE_LIMITS[plan as keyof typeof STORAGE_LIMITS],
        storageUsed: 0,
      });
    } else {
      // Update existing storage record
      await db
        .update(userStorage)
        .set({
          plan,
          storageLimit: STORAGE_LIMITS[plan as keyof typeof STORAGE_LIMITS],
          lastUpdated: new Date(),
        })
        .where(eq(userStorage.userId, userId));
    }

    // Redirect to dashboard with success message
    return Response.redirect(new URL('/dashboard?upgraded=true', request.url));
  } catch (error) {
    console.error("Error updating plan:", error);
    return Response.redirect(new URL('/dashboard?error=true', request.url));
  }
}