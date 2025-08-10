import { NextRequest, NextResponse } from 'next/server';
import { checkAdminIPRestriction } from '@/lib/admin-security';

export async function POST(request: NextRequest) {
  // Check IP restrictions first
  const ipCheck = checkAdminIPRestriction(request);
  
  if (!ipCheck.isAllowed) {
    return ipCheck.response;
  }

  try {
    const body = await request.json();
    const { userId, password } = body;

    // Validate required fields
    if (!userId || !password) {
      return NextResponse.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against environment variables
    const adminUserId = process.env.ADMIN_USER_ID;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUserId || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (userId === adminUserId && password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        clientIP: ipCheck.clientIP,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your User ID and password.' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}