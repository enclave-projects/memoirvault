import { NextRequest, NextResponse } from 'next/server';
import { checkAdminIPRestriction, getRealIP } from '@/lib/admin-security';

export async function GET(request: NextRequest) {
  const ipCheck = checkAdminIPRestriction(request);
  
  if (!ipCheck.isAllowed) {
    return ipCheck.response;
  }
  
  return NextResponse.json({
    success: true,
    message: 'IP address is authorized for admin access',
    clientIP: ipCheck.clientIP,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  return GET(request); // Same logic for both GET and POST
}