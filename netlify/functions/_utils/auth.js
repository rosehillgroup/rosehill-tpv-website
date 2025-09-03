// Authentication helper for Netlify Functions
// Validates JWT tokens from Auth0 and enforces editor role

import { createRemoteJWKSet, jwtVerify } from 'jose';

// Normalize issuer URL - Auth0 tokens include trailing slash
const ISSUER = process.env.AUTH0_ISSUER_BASE_URL?.endsWith('/') 
  ? process.env.AUTH0_ISSUER_BASE_URL 
  : process.env.AUTH0_ISSUER_BASE_URL + '/';
const AUDIENCE = process.env.AUTH0_AUDIENCE;
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}.well-known/jwks.json`));

/**
 * Validate that the request has a valid Auth0 JWT token with editor role
 * @param {Object} event - Netlify function event
 * @param {string} allowedOrigin - Optional allowed origin for CORS validation
 * @returns {Object} - { ok: boolean, status?: number, msg?: string, user?: object }
 */
export async function requireEditorRole(event, allowedOrigin) {
  try {
    // Extract JWT token from Authorization header
    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    
    if (!token) {
      return { 
        ok: false, 
        status: 401, 
        msg: 'Missing authorization token' 
      };
    }

    // Verify JWT token with Auth0
    const { payload } = await jwtVerify(token, JWKS, { 
      issuer: ISSUER, 
      audience: AUDIENCE 
    });
    
    // Check user roles (Auth0 can store roles in various claim formats)
    const roles = payload['https://tpv.rosehill.group/roles'] || 
                  payload.permissions || 
                  payload.roles || 
                  [];
    
    if (!roles.includes('editor')) {
      return { 
        ok: false, 
        status: 403, 
        msg: 'Forbidden - editor role required' 
      };
    }
    
    // Optional origin validation for additional security
    if (allowedOrigin) {
      const origin = event.headers.origin || event.headers.referer || '';
      
      // Allow both exact match and referer that starts with allowed origin
      const isValidOrigin = origin === allowedOrigin || 
                           origin.startsWith(allowedOrigin) ||
                           origin.includes('.netlify.app'); // Allow Netlify previews
      
      if (!isValidOrigin) {
        return { 
          ok: false, 
          status: 403, 
          msg: 'Forbidden - invalid origin' 
        };
      }
    }
    
    // All checks passed
    return { 
      ok: true, 
      user: payload 
    };
    
  } catch (error) {
    return { 
      ok: false, 
      status: 401, 
      msg: 'Invalid token' 
    };
  }
}

/**
 * Rate limiting helper (basic implementation)
 * In production, consider using a more robust solution with Redis or similar
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

export function checkRateLimit(userId) {
  const now = Date.now();
  const userKey = `user_${userId}`;
  
  // Get or initialize user's request data
  if (!requestCounts.has(userKey)) {
    requestCounts.set(userKey, { count: 0, resetTime: now + RATE_LIMIT_WINDOW });
  }
  
  const userData = requestCounts.get(userKey);
  
  // Reset if window has passed
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Check if limit exceeded
  if (userData.count >= MAX_REQUESTS) {
    return { 
      ok: false, 
      retryAfter: Math.ceil((userData.resetTime - now) / 1000) 
    };
  }
  
  // Increment count
  userData.count++;
  
  return { ok: true };
}

/**
 * Clean up old rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime + RATE_LIMIT_WINDOW) {
      requestCounts.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW * 2);

/**
 * Create standard error response
 */
export function errorResponse(message, status = 500, corsHeaders = {}) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...corsHeaders
      }
    }
  );
}

/**
 * Create standard success response
 */
export function successResponse(data, status = 200, corsHeaders = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...corsHeaders
      }
    }
  );
}

/**
 * Log safely without exposing secrets
 */
export function safeLog(message, data = {}) {
  // Remove any potential secrets from logging
  const safeData = { ...data };
  delete safeData.token;
  delete safeData.authorization;
  delete safeData.password;
  delete safeData.secret;
  delete safeData.key;
  delete safeData.SANITY_TOKEN;
  delete safeData.DEEPL_KEY;
  
  console.log(message, safeData);
}