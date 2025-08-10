import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteStatus } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Default services to monitor
const defaultServices = [
  {
    serviceName: 'website',
    status: 'operational' as const,
    description: 'Main website and user interface'
  },
  {
    serviceName: 'api',
    status: 'operational' as const,
    description: 'API endpoints and backend services'
  },
  {
    serviceName: 'database',
    status: 'operational' as const,
    description: 'Database connectivity and performance'
  },
  {
    serviceName: 'storage',
    status: 'operational' as const,
    description: 'File storage and media uploads'
  },
  {
    serviceName: 'authentication',
    status: 'operational' as const,
    description: 'User login and authentication services'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get current status for all services
    const services = await db.select().from(siteStatus);
    
    // If no services exist, seed with defaults
    if (services.length === 0) {
      await db.insert(siteStatus).values(
        defaultServices.map(service => ({
          ...service,
          lastChecked: new Date()
        }))
      );
      
      const newServices = await db.select().from(siteStatus);
      return NextResponse.json({ services: newServices });
    }

    return NextResponse.json({ services });

  } catch (error) {
    console.error('Error fetching site status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceName, status, description } = body;

    // Validate required fields
    if (!serviceName || !status) {
      return NextResponse.json(
        { error: 'Service name and status are required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update or insert service status
    const existingService = await db
      .select()
      .from(siteStatus)
      .where(eq(siteStatus.serviceName, serviceName))
      .limit(1);

    if (existingService.length > 0) {
      // Update existing service
      await db
        .update(siteStatus)
        .set({
          status,
          description: description || null,
          lastChecked: new Date(),
          updatedAt: new Date()
        })
        .where(eq(siteStatus.serviceName, serviceName));
    } else {
      // Insert new service
      await db.insert(siteStatus).values({
        serviceName,
        status,
        description: description || null,
        lastChecked: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Service status updated successfully'
    });

  } catch (error) {
    console.error('Error updating site status:', error);
    return NextResponse.json(
      { error: 'Failed to update site status' },
      { status: 500 }
    );
  }
}