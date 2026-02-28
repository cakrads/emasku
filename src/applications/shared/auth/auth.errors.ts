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
 * Create a structured auth error
 * 
 * @param code - Error code
 * @param debugMessage - Technical details (only shown in dev)
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
 * Map Supabase error to AuthError
 * Extracts known error patterns and sanitizes output
 */
export function mapSupabaseError(error: unknown): AuthError {
  // Handle null/undefined
  if (!error) {
    return createAuthError('AUTH_UNKNOWN', 'Unknown error occurred')
  }

  // Extract and normalize error message
  const rawMessage = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error)

  const message = rawMessage.toLowerCase()

  // Map known Supabase error patterns
  if (message.includes('invalid login credentials')) {
    return createAuthError('AUTH_INVALID_CREDENTIALS', rawMessage)
  }

  if (message.includes('jwt expired') || message.includes('session_not_found')) {
    return createAuthError('AUTH_SESSION_EXPIRED', rawMessage)
  }

  if (message.includes('refresh_token')) {
    return createAuthError('AUTH_REFRESH_FAILED', rawMessage)
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return createAuthError('AUTH_RATE_LIMITED', rawMessage)
  }

  if (message.includes('network') || message.includes('fetch')) {
    return createAuthError('AUTH_NETWORK_ERROR', rawMessage)
  }

  if (message.includes('popup') || message.includes('blocked')) {
    return createAuthError('AUTH_POPUP_BLOCKED', rawMessage)
  }

  return createAuthError('AUTH_UNKNOWN', rawMessage)
}
