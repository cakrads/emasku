/**
 * Auth API Service
 * 
 * Frontend API boundary for authentication.
 * Calls the shared auth module and provides a clean interface.
 */

import {
  loginAsGuest as serviceLoginAsGuest,
  loginWithGoogle as serviceLoginWithGoogle,
  signOut as serviceSignOut,
  getSession as serviceGetSession,
  onAuthStateChange as serviceOnAuthStateChange,
  type AuthSession,
  type AuthResult,
} from '@/applications/shared/auth'

/**
 * Login as guest user
 */
export async function loginAsGuest(): Promise<AuthResult<AuthSession>> {
  return serviceLoginAsGuest()
}

/**
 * Login with Google OAuth
 * Returns a URL to redirect to for authentication
 */
export async function loginWithGoogle(): Promise<AuthResult<{ url: string }>> {
  return serviceLoginWithGoogle()
}

/**
 * Get current session
 */
export async function getSession(): Promise<AuthResult<AuthSession | null>> {
  return serviceGetSession()
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult<void>> {
  return serviceSignOut()
}


/**
 * Record user consent for UU PDP compliance
 */
export async function recordConsent(params: {
  purposes: string[],
  version: string,
  isGranted?: boolean
}): Promise<AuthResult<void>> {
  try {
    const response = await fetch('/api/v1/auth/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      return { success: false, error: { code: 'AUTH_UNKNOWN', userMessage: 'Gagal mencatat persetujuan' } }
    }

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: { code: 'AUTH_UNKNOWN', userMessage: 'Gagal mencatat persetujuan' } }
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (session: AuthSession | null) => void
): () => void {
  return serviceOnAuthStateChange(callback)
}
