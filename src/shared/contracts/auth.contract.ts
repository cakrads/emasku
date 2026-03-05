/**
 * Auth Shared Contracts
 *
 * Shared type definitions for authentication.
 * Both frontend and backend import from here — never cross-pillar.
 */

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthProvider = 'guest' | 'google'

export interface AuthUser {
  id: string
  email: string | null
  provider: AuthProvider
  isGuest: boolean
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresAt: number // Unix timestamp
}

export type AuthErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_REFRESH_FAILED'
  | 'AUTH_NETWORK_ERROR'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_POPUP_BLOCKED'
  | 'AUTH_UNKNOWN'

export type AuthRecoveryAction = 'retry' | 'relogin' | 'contact_support'

export interface AuthError {
  code: AuthErrorCode
  userMessage: string
  debugMessage?: string
  recoveryAction?: AuthRecoveryAction
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  session: AuthSession | null
  error: AuthError | null
}

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError }
