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
 * Indicates whether Redis-backed rate limiting is configured via environment variables.
 *
 * @returns `true` if both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, `false` otherwise.
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
 * Enforces the configured rate limit for a given endpoint and requester identifier.
 *
 * When rate limiting is not configured, returns a permissive result allowing requests.
 *
 * @param endpoint - The key identifying which configured rate limiter to apply
 * @param identifier - The requester identifier used to track usage (e.g., IP address or user ID)
 * @returns A RateLimitResult where `success` is true if the request is allowed, `false` otherwise; `remaining` is the number of requests left in the current window; `reset` is the epoch milliseconds when the limit window resets; `limit` is the maximum requests allowed in the window
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