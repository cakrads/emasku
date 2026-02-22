/**
 * Environment Configuration Constants
 * 
 * This module centralizes all environment variable access.
 * All other modules should import from here, never directly access process.env.
 */

/**
 * Database connection string (Direct URL for migrations/seeds, Transaction URL for runtime)
 */
export const DATABASE_URL = process.env.DATABASE_URL || ''
export const DIRECT_URL = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

/**
 * Scraper Configuration
 */
export const SCRAPER_SOURCE_URL = process.env.SCRAPER_SOURCE || 'https://galeri24.co.id/harga-emas'
export const SCRAPER_SECRET = process.env.SCRAPER_SECRET // Secret for API endpoint protection

/**
 * Node Environment
 */
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_DEVELOPMENT = NODE_ENV === 'development'

/**
 * Application Configuration
 */
export const PORT = parseInt(process.env.PORT || '3000', 10)

/**
 * Supabase Configuration
 * These are public keys, safe to expose to the browser
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''

/**
 * Validates that required Supabase environment variables are present.
 *
 * Checks NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; if any are missing, throws an Error when NODE_ENV is "production" and logs a console warning otherwise.
 */
export function validateEnv(): void {
  const missing: string[] = []

  if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')

  if (missing.length > 0 && IS_PRODUCTION) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`)
  }
}