import { NextRequest, NextResponse } from 'next/server';
import { getRealIP } from '@/lib/admin-security';

export async function GET(request: NextRequest) {
  const clientIP = getRealIP(request);
  
  return NextResponse.json({
    ip: clientIP,
    headers: {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
      'x-client-ip': request.headers.get('x-client-ip'),
    },
    message: 'Add this IP to ADMIN_ALLOWED_IPS in your .env file',
    timestamp: new Date().toISOString()
  });
}