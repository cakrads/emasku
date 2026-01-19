/**
 * Rate Limiter - Upstash Redis Implementation
 * 
 * Provides rate limiting for public API endpoints.
 * Uses sliding window algorithm for fair distribution.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client (uses env vars)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

/**
 * Check if rate limiting is enabled (env vars present)
 */
export function isRateLimitEnabled(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Rate limiters for different endpoints
 * 
 * - pricesToday: Higher limit (60/min) - frequently accessed
 * - pricesSpot: Lower limit (20/min) - heavier query
 */
export const rateLimiters = {
  pricesToday: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    prefix: 'rl:prices:today',
    analytics: true,
  }),
  pricesSpot: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
    prefix: 'rl:prices:spot',
    analytics: true,
  }),
  brands: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    prefix: 'rl:brands',
    analytics: true,
  }),
  portfolioRead: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    prefix: 'rl:portfolio:read',
    analytics: true,
  }),
  portfolioWrite: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    prefix: 'rl:portfolio:write',
    analytics: true,
  }),
  system: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    prefix: 'rl:system',
    analytics: true,
  }),
}

export type RateLimitResult = {
  success: boolean
  remaining: number
  reset: number
  limit: number
}

/**
 * Apply rate limiting to a request
 */
export async function checkRateLimit(
  endpoint: keyof typeof rateLimiters,
  identifier: string
): Promise<RateLimitResult> {
  if (!isRateLimitEnabled()) {
    // Skip rate limiting in development if not configured
    return { success: true, remaining: 999, reset: Date.now() + 60000, limit: 999 }
  }

  const limiter = rateLimiters[endpoint]
  const result = await limiter.limit(identifier)

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  }
}
