// Test function to verify Auth0 JWT verification
// Returns user info and roles to verify authentication is working

import { requireEditorRole, errorResponse, successResponse } from './_utils/auth.js';

export async function handler(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }
  
  // Verify authentication and editor role
  const authResult = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  
  if (!authResult.ok) {
    return errorResponse(authResult.msg, authResult.status);
  }
  
  // Extract useful info from the JWT payload
  const userInfo = {
    sub: authResult.user.sub,
    email: authResult.user.email,
    roles: authResult.user['https://tpv.rosehill.group/roles'] || [],
    aud: authResult.user.aud,
    iss: authResult.user.iss,
    exp: new Date(authResult.user.exp * 1000).toISOString(),
    iat: new Date(authResult.user.iat * 1000).toISOString()
  };
  
  return successResponse({
    message: 'Authentication successful',
    user: userInfo,
    timestamp: new Date().toISOString(),
    environment: {
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      audience: process.env.AUTH0_AUDIENCE,
      allowedOrigin: process.env.ALLOWED_ORIGIN
    }
  });
}