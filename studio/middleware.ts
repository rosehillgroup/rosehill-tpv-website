import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Edge Middleware - Geo-location Cookie
 * Replicates Netlify's geo-cookie edge function
 * Sets nl_geo cookie with user's geographic information
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get geo data from Vercel's request object
  const geo = {
    country: request.geo?.country || '',
    region: request.geo?.region || '',
    city: request.geo?.city || '',
    latitude: request.geo?.latitude || '',
    longitude: request.geo?.longitude || '',
    timezone: request.geo?.timezone || ''
  };

  // Encode geo data as JSON string
  const geoValue = encodeURIComponent(JSON.stringify(geo));

  // Set cookie with 15-minute expiry (900 seconds)
  response.cookies.set('nl_geo', geoValue, {
    path: '/',
    maxAge: 900,
    sameSite: 'lax',
    domain: process.env.VERCEL_ENV === 'production' ? '.rosehill.group' : undefined,
    httpOnly: false,
    secure: true
  });

  return response;
}

// Configure which paths this middleware runs on
export const config = {
  matcher: '/:path*'
};
