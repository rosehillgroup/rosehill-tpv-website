/**
 * Rate Limiting Middleware for TPV Studio
 * Protects expensive AI endpoints from abuse
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize rate limiter with Upstash Redis
// Vercel provides KV_REST_API_URL and KV_REST_API_TOKEN
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour per user
  analytics: true,
  prefix: 'tpv_ratelimit',
});

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // List of expensive AI endpoints that need rate limiting
  const expensiveEndpoints = [
    '/api/recraft-generate',
    '/api/recraft-vectorize',
    '/api/vectorise',
    '/api/generate-design-name',
    '/api/export-pdf'
  ];

  // Check if this request is to an expensive endpoint
  const isExpensiveEndpoint = expensiveEndpoints.some(endpoint =>
    pathname.startsWith(endpoint)
  );

  if (isExpensiveEndpoint) {
    // Get user identifier from request
    // Try to get user ID from auth header, fall back to IP
    const authHeader = request.headers.get('authorization');
    let identifier = request.ip || 'anonymous';

    // If we have an auth token, we can extract user ID
    // For now, use IP as identifier (you can enhance this later)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Use token as identifier (it's unique per user)
      identifier = authHeader.substring(7, 50); // First 50 chars of token
    }

    console.log(`[RATE-LIMIT] Checking limit for ${pathname} - identifier: ${identifier.substring(0, 20)}...`);

    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

      if (!success) {
        console.warn(`[RATE-LIMIT] Limit exceeded for ${pathname} - identifier: ${identifier.substring(0, 20)}...`);

        return new NextResponse(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            limit,
            remaining: 0,
            reset: new Date(reset).toISOString(),
            message: `You've reached the limit of ${limit} requests per hour for this operation. Please try again after ${new Date(reset).toLocaleTimeString()}.`
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }

      console.log(`[RATE-LIMIT] Request allowed - ${remaining}/${limit} remaining`);

      // Clone the response to add rate limit headers
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      return response;
    } catch (error) {
      // If rate limiting fails, log error but allow request (fail open)
      console.error('[RATE-LIMIT] Error checking rate limit:', error);
      return NextResponse.next();
    }
  }

  // Not an expensive endpoint, continue without rate limiting
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: '/api/:path*',
};
