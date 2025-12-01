/**
 * Rate Limiting Utility for API Endpoints
 * Uses Upstash Redis for serverless rate limiting
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Define rate limits per endpoint
const ENDPOINT_LIMITS = {
  '/api/recraft-generate': { requests: 10, window: '1 h' },
  '/api/recraft-vectorize': { requests: 10, window: '1 h' },
  '/api/vectorise': { requests: 10, window: '1 h' },
  '/api/generate-design-name': { requests: 50, window: '1 h' },
  '/api/export-pdf': { requests: 20, window: '1 h' },
};

// Create rate limiter instances for each endpoint
const rateLimiters = {};
for (const [endpoint, config] of Object.entries(ENDPOINT_LIMITS)) {
  rateLimiters[endpoint] = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `tpv_ratelimit:${endpoint}`,
  });
}

/**
 * Check if request should be rate limited
 * @param {string} identifier - User ID, IP, or other unique identifier
 * @param {string} endpoint - Endpoint name for logging
 * @param {Object} options - Options
 * @param {boolean} options.failOpen - If true, allow request on error (default: false)
 * @returns {Promise<{allowed: boolean, limit: number, remaining: number, reset: number, error?: string}>}
 */
export async function checkRateLimit(identifier, endpoint = 'unknown', options = {}) {
  const { failOpen = false } = options;

  try {
    // Get the appropriate rate limiter for this endpoint
    const ratelimiter = rateLimiters[endpoint];

    if (!ratelimiter) {
      console.warn(`[RATE-LIMIT] No rate limiter configured for endpoint: ${endpoint}`);
      // No limiter configured - allow request (this is a config issue, not a service failure)
      const defaultLimit = ENDPOINT_LIMITS[endpoint]?.requests || 10;
      return {
        allowed: true,
        limit: defaultLimit,
        remaining: defaultLimit,
        reset: Date.now() + 3600000
      };
    }

    const result = await ratelimiter.limit(identifier);

    if (!result.success) {
      console.warn(`[RATE-LIMIT] Limit exceeded - endpoint: ${endpoint}`);
    }

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset
    };
  } catch (error) {
    console.error(`[RATE-LIMIT] Service error:`, error.message);

    // SECURITY: Fail closed by default to prevent abuse when rate limiting is down
    if (failOpen) {
      console.warn(`[RATE-LIMIT] Failing OPEN for ${endpoint} (configured)`);
      const defaultLimit = ENDPOINT_LIMITS[endpoint]?.requests || 10;
      return {
        allowed: true,
        limit: defaultLimit,
        remaining: defaultLimit,
        reset: Date.now() + 3600000,
        error: 'Rate limit service unavailable - request allowed (fail-open)'
      };
    }

    console.warn(`[RATE-LIMIT] Failing CLOSED for ${endpoint} (security default)`);
    return {
      allowed: false,
      limit: 0,
      remaining: 0,
      reset: Date.now() + 60000, // Retry in 1 minute
      error: 'Rate limit service unavailable - please try again shortly'
    };
  }
}

/**
 * Get rate limit response object for 429 error
 * @param {number} limit - Rate limit
 * @param {number} remaining - Requests remaining
 * @param {number} reset - Timestamp when limit resets
 * @returns {Object} Response object
 */
export function getRateLimitResponse(limit, remaining, reset) {
  return {
    success: false,
    error: 'Rate limit exceeded',
    limit,
    remaining,
    reset: new Date(reset).toISOString(),
    message: `You've reached the limit of ${limit} requests per hour for this operation. Please try again after ${new Date(reset).toLocaleTimeString()}.`
  };
}

/**
 * Get identifier for rate limiting from request
 * @param {Object} req - Request object
 * @param {Object} user - User object (if authenticated)
 * @returns {string} Identifier for rate limiting
 */
export function getRateLimitIdentifier(req, user = null) {
  // Prefer user ID if authenticated
  if (user && user.id) {
    return `user:${user.id}`;
  }

  // Fall back to IP address
  const ip = req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection?.remoteAddress ||
             'unknown';

  return `ip:${ip}`;
}
