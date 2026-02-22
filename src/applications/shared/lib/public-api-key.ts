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
 * Determine validity and client type for a public API key.
 *
 * If `key` is null, empty, or does not start with a recognized prefix, it is treated as invalid.
 *
 * @param key - The public API key to evaluate, or `null`
 * @returns An object with `isValid` indicating whether the key is accepted, `clientType` set to `'web'`, `'mobile'`, or `'unknown'` based on the key contents, and `keyPrefix` containing the first 20 characters of the provided key (or an empty string when invalid)
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
 * Determine whether public API key validation is enforced for incoming requests.
 *
 * @returns `true` if the application is running in production or the `ENFORCE_PUBLIC_API_KEY` environment variable is set to `'true'`, `false` otherwise.
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
 * Determines whether a User-Agent string should be blocked for public endpoints.
 *
 * Treats `null`, empty, or whitespace-only values as blocked; otherwise tests the value against the module's blocked patterns.
 *
 * @param userAgent - The User-Agent header value to evaluate; `null` or empty values are treated as blocked.
 * @returns `true` if the User-Agent is blocked, `false` otherwise.
 */
export function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim() === '') {
    return true // Block empty/missing UA
  }

  return BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent))
}