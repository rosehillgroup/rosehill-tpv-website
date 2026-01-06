/**
 * Caching Utility for API Endpoints
 * Uses Upstash Redis for hash-based caching
 */

import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Generate SHA-256 hash of inputs for cache key
 * @param {any} inputs - Object/array/string to hash
 * @returns {string} Truncated hash (32 chars)
 */
export function hashInputs(inputs) {
  const stringified = typeof inputs === 'string' ? inputs : JSON.stringify(inputs);
  return crypto.createHash('sha256')
    .update(stringified)
    .digest('hex')
    .slice(0, 32); // Truncate for reasonable key length
}

/**
 * Get cached value by key
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null
 */
export async function getCached(key) {
  try {
    const value = await redis.get(key);
    return value;
  } catch (error) {
    console.warn('[CACHE] Get failed:', error.message);
    return null;
  }
}

/**
 * Set cache value with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified if object)
 * @param {number} ttlSeconds - Time to live in seconds (default 1 hour)
 */
export async function setCache(key, value, ttlSeconds = 3600) {
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch (error) {
    console.warn('[CACHE] Set failed:', error.message);
  }
}

/**
 * Delete cache entry
 * @param {string} key - Cache key
 */
export async function deleteCache(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.warn('[CACHE] Delete failed:', error.message);
  }
}

/**
 * Check if cache entry exists
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
export async function cacheExists(key) {
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.warn('[CACHE] Exists check failed:', error.message);
    return false;
  }
}

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  DESIGN_NAME: 86400,      // 24 hours - AI generated names
  PDF_URL: 600,            // 10 minutes - PDF storage URLs
  AI_RESPONSE: 3600,       // 1 hour - Generic AI responses
  SHORT: 300,              // 5 minutes
  MEDIUM: 3600,            // 1 hour
  LONG: 86400,             // 24 hours
};

// Cache key prefixes
export const CACHE_PREFIX = {
  DESIGN_NAME: 'name:',
  PDF: 'pdf:',
  AI: 'ai:',
};
