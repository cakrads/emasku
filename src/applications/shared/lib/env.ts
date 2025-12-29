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
