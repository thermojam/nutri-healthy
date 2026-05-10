import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const method = request.method;
  const pathname = request.nextUrl.pathname;

  // Log API requests for monitoring
  if (pathname.startsWith('/api/')) {
    console.info(`[${timestamp}] ${method} ${pathname} (${requestId})`);

    // Add request ID to response headers for tracing
    const response = NextResponse.next();
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Request-Timestamp', timestamp);

    return response;
  }

  // Security: Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
