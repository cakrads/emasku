/**
 * Auth Types Module
 * 
 * Pure type definitions for authentication.
 * No Supabase types should leak outside this file.
 */

/**
 * Authentication status states
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * Supported authentication providers
 */
export type AuthProvider = 'guest' | 'google'

/**
 * Authenticated user representation
 * Abstract away Supabase-specific user structure
 */
export interface AuthUser {
  id: string
  email: string | null
  provider: AuthProvider
  isGuest: boolean
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

/**
 * Session information
 */
export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresAt: number // Unix timestamp
}

/**
 * Error codes for auth operations
 */
export type AuthErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_REFRESH_FAILED'
  | 'AUTH_NETWORK_ERROR'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_POPUP_BLOCKED'
  | 'AUTH_UNKNOWN'

/**
 * Recovery action suggestions for errors
 */
export type AuthRecoveryAction = 'retry' | 'relogin' | 'contact_support'

/**
 * Structured auth error with user-safe messaging
 */
export interface AuthError {
  code: AuthErrorCode
  userMessage: string      // Safe for UI display
  debugMessage?: string    // Only populated in dev
  recoveryAction?: AuthRecoveryAction
}

/**
 * Auth state for the store
 */
export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  session: AuthSession | null
  error: AuthError | null
}

/**
 * Result type for auth operations
 */
export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError }
