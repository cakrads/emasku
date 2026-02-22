/**
 * Auth Error Handling Module
 * 
 * Centralizes error creation and sanitization.
 * NEVER expose raw Supabase errors to UI.
 */

import { AuthError, AuthErrorCode, AuthRecoveryAction } from './auth.types'
import { IS_DEVELOPMENT } from '../lib/env'

/**
 * User-friendly error messages mapped by error code
 */
const USER_MESSAGES: Record<AuthErrorCode, string> = {
  AUTH_INVALID_CREDENTIALS: 'Login gagal. Silakan coba lagi.',
  AUTH_SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  AUTH_REFRESH_FAILED: 'Gagal memperbarui sesi. Silakan login kembali.',
  AUTH_NETWORK_ERROR: 'Terjadi gangguan jaringan. Periksa koneksi internet Anda.',
  AUTH_RATE_LIMITED: 'Terlalu banyak percobaan. Tunggu beberapa saat.',
  AUTH_POPUP_BLOCKED: 'Popup diblokir. Izinkan popup untuk login dengan Google.',
  AUTH_UNKNOWN: 'Terjadi kesalahan. Silakan coba lagi.',
}

/**
 * Recovery actions mapped by error code
 */
const RECOVERY_ACTIONS: Record<AuthErrorCode, AuthRecoveryAction> = {
  AUTH_INVALID_CREDENTIALS: 'retry',
  AUTH_SESSION_EXPIRED: 'relogin',
  AUTH_REFRESH_FAILED: 'relogin',
  AUTH_NETWORK_ERROR: 'retry',
  AUTH_RATE_LIMITED: 'retry',
  AUTH_POPUP_BLOCKED: 'retry',
  AUTH_UNKNOWN: 'contact_support',
}

/**
 * Constructs a sanitized AuthError object for the provided auth error code.
 *
 * Includes a user-facing message and a recovery action; the supplied `debugMessage`
 * is attached only when running in a development environment.
 *
 * @param code - The AuthErrorCode representing the error scenario
 * @param debugMessage - Technical details to include for debugging (development only)
 * @returns An AuthError containing `code`, `userMessage`, optional `debugMessage`, and `recoveryAction`
 */
export function createAuthError(
  code: AuthErrorCode,
  debugMessage?: string
): AuthError {
  return {
    code,
    userMessage: USER_MESSAGES[code],
    debugMessage: IS_DEVELOPMENT ? debugMessage : undefined,
    recoveryAction: RECOVERY_ACTIONS[code],
  }
}

/**
 * Maps a Supabase-style error to a sanitized AuthError with a user-facing message and recovery action.
 *
 * Extracts a text message from the input, matches known patterns to select a specific AuthErrorCode, and returns the corresponding AuthError. If the input is null/undefined or no known pattern matches, returns an AuthError with code `AUTH_UNKNOWN`. The original error message is preserved for development-only debug output.
 *
 * @returns An AuthError corresponding to the supplied error; the original message is preserved as a development-only `debugMessage`.
 */
export function mapSupabaseError(error: unknown): AuthError {
  // Handle null/undefined
  if (!error) {
    return createAuthError('AUTH_UNKNOWN', 'Unknown error occurred')
  }

  // Extract error message
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error)

  // Map known Supabase error patterns
  if (message.includes('Invalid login credentials')) {
    return createAuthError('AUTH_INVALID_CREDENTIALS', message)
  }

  if (message.includes('JWT expired') || message.includes('session_not_found')) {
    return createAuthError('AUTH_SESSION_EXPIRED', message)
  }

  if (message.includes('refresh_token')) {
    return createAuthError('AUTH_REFRESH_FAILED', message)
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return createAuthError('AUTH_RATE_LIMITED', message)
  }

  if (message.includes('network') || message.includes('fetch')) {
    return createAuthError('AUTH_NETWORK_ERROR', message)
  }

  if (message.includes('popup') || message.includes('blocked')) {
    return createAuthError('AUTH_POPUP_BLOCKED', message)
  }

  return createAuthError('AUTH_UNKNOWN', message)
}