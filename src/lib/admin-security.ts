import { NextRequest } from 'next/server';

/**
 * Get the real IP address from the request
 * Handles various proxy headers and deployment scenarios
 */
export function getRealIP(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  const xClientIP = request.headers.get('x-client-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  
  // Priority order for IP detection
  let ip = cfConnectingIP || realIP || xClientIP || forwardedFor;
  
  // Handle comma-separated IPs (x-forwarded-for can contain multiple IPs)
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  // Handle IPv6 mapped IPv4 addresses
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }
  
  // Fallback to localhost if no IP is found
  return ip || '127.0.0.1';
}

/**
 * Check if the IP address is allowed to access admin panel
 */
export function isAdminIPAllowed(ip: string): boolean {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',').map(ip => ip.trim()) || [];
  
  // Always allow localhost variations for development
  const localhostIPs = ['127.0.0.1', '::1', 'localhost'];
  
  // Combine configured IPs with localhost IPs
  const allAllowedIPs = [...allowedIPs, ...localhostIPs];
  
  return allAllowedIPs.includes(ip);
}

/**
 * Create an IP restriction response
 */
export function createIPRestrictionResponse() {
  return new Response(
    JSON.stringify({
      error: 'Access Denied',
      message: 'Admin panel access is restricted to authorized IP addresses only.',
      code: 'IP_RESTRICTED'
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Middleware function to check IP restrictions for admin routes
 */
export function checkAdminIPRestriction(request: NextRequest) {
  const clientIP = getRealIP(request);
  const isAllowed = isAdminIPAllowed(clientIP);
  
  console.log(`Admin access attempt from IP: ${clientIP}, Allowed: ${isAllowed}`);
  
  return {
    isAllowed,
    clientIP,
    response: isAllowed ? null : createIPRestrictionResponse()
  };
}