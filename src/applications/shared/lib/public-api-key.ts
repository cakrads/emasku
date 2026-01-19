/**
 * Public API Key Validation
 * 
 * Validates x-public-key header for public API endpoints.
 * Keys are non-secret identifiers used for rate limiting and analytics.
 */

/**
 * Valid public API key prefixes
 * Format: emasku_pub_v1_<client>_<id>
 */
const VALID_KEY_PREFIXES = ['emasku_pub_v1_web', 'emasku_pub_v1_mobile']

/**
 * Hardcoded keys for MVP (move to database in production)
 * These are non-secret, visible in frontend code
 */
const VALID_KEYS = new Set([
  process.env.NEXT_PUBLIC_API_KEY_WEB || 'emasku_pub_v1_web_default',
  process.env.NEXT_PUBLIC_API_KEY_MOBILE || 'emasku_pub_v1_mobile_default',
])

export interface PublicApiKeyInfo {
  isValid: boolean
  clientType: 'web' | 'mobile' | 'unknown'
  keyPrefix: string
}

/**
 * Validate a public API key
 */
export function validatePublicApiKey(key: string | null): PublicApiKeyInfo {
  if (!key) {
    return { isValid: false, clientType: 'unknown', keyPrefix: '' }
  }

  // Check format
  const hasValidPrefix = VALID_KEY_PREFIXES.some(prefix => key.startsWith(prefix))
  if (!hasValidPrefix) {
    return { isValid: false, clientType: 'unknown', keyPrefix: '' }
  }

  // For MVP: accept any key with valid prefix
  // In production: validate against database
  const isValid = VALID_KEYS.has(key) || hasValidPrefix

  // Extract client type
  let clientType: PublicApiKeyInfo['clientType'] = 'unknown'
  if (key.includes('_web_')) clientType = 'web'
  else if (key.includes('_mobile_')) clientType = 'mobile'

  return {
    isValid,
    clientType,
    keyPrefix: key.substring(0, 20),
  }
}

/**
 * Check if public API key validation is enforced
 * In development, we may skip validation if not configured
 */
export function isPublicApiKeyRequired(): boolean {
  return process.env.NODE_ENV === 'production' ||
    process.env.ENFORCE_PUBLIC_API_KEY === 'true'
}

/**
 * Blocked User-Agent patterns (scrapers, bots)
 */
const BLOCKED_USER_AGENTS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /scrapy/i,
  /httpclient/i,
  /java\//i,
  /libwww/i,
  /^$/,  // Empty UA
]

/**
 * Check if User-Agent is blocked
 */
export function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim() === '') {
    return true // Block empty/missing UA
  }

  return BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent))
}
