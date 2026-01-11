/**
 * Auth Module Exports
 * 
 * Public API for the auth module.
 * Note: createServerSupabaseClient is in a separate file (supabase.server.ts)
 * to avoid importing next/headers in client bundles.
 */

// Types
export type {
  AuthUser,
  AuthSession,
  AuthStatus,
  AuthProvider,
  AuthError,
  AuthErrorCode,
  AuthResult,
  AuthState,
} from './auth.types'

// Error handling
export { createAuthError, mapSupabaseError } from './auth.errors'

// Supabase browser client (safe for client components)
export {
  createBrowserSupabaseClient,
  getBrowserSupabaseClient,
} from './supabase.client'

// Auth service
export {
  loginAsGuest,
  loginWithGoogle,
  getSession,
  getUser,
  signOut,
  onAuthStateChange,
} from './auth.service'
