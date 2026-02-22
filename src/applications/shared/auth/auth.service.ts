/**
 * Auth Service Module
 * 
 * Core authentication logic. Hides Supabase implementation details.
 * All auth operations go through this service.
 */

import { getBrowserSupabaseClient } from './supabase.client'
import { AuthUser, AuthSession, AuthResult, AuthProvider } from './auth.types'
import { mapSupabaseError } from './auth.errors'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

/**
 * Create an AuthUser object from a Supabase User.
 *
 * @param user - Supabase `User` to map
 * @returns An `AuthUser` with `id`, `email` (or `null`), `provider` (`'guest'` or `'google'`), `isGuest`, `displayName` (or `null`), `avatarUrl` (or `null`), and `createdAt`
 */
function mapUser(user: User): AuthUser {
  const provider = user.app_metadata?.provider as string | undefined
  const isGuest = user.is_anonymous === true

  return {
    id: user.id,
    email: user.email ?? null,
    provider: isGuest ? 'guest' : (provider === 'google' ? 'google' : 'guest') as AuthProvider,
    isGuest,
    displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    createdAt: user.created_at,
  }
}

/**
 * Convert a Supabase Session into the project's AuthSession shape.
 *
 * @param session - Supabase `Session` to map
 * @returns The corresponding `AuthSession` with `user`, `accessToken`, and `expiresAt` (defaults to `0` when missing)
 */
function mapSession(session: Session): AuthSession {
  return {
    user: mapUser(session.user),
    accessToken: session.access_token,
    expiresAt: session.expires_at ?? 0,
  }
}

/**
 * Signs in the user anonymously and returns the resulting authentication session.
 *
 * @returns On success, an `AuthResult` whose `data` is the mapped `AuthSession`; on failure, an `AuthResult` whose `error` is the mapped error
 */
export async function loginAsGuest(): Promise<AuthResult<AuthSession>> {
  try {
    const supabase = getBrowserSupabaseClient()
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      return { success: false, error: mapSupabaseError(error) }
    }

    if (!data.session) {
      return { success: false, error: mapSupabaseError(new Error('No session returned')) }
    }

    return { success: true, data: mapSession(data.session) }
  } catch (error) {
    return { success: false, error: mapSupabaseError(error) }
  }
}

/**
 * Initiates a Google OAuth flow and provides the OAuth redirect URL.
 *
 * @returns The OAuth redirect URL as `{ url: string }` when successful; otherwise the result contains a mapped error.
export async function loginWithGoogle(): Promise<AuthResult<{ url: string }>> {
  try {
    const supabase = getBrowserSupabaseClient()
    const redirectTo = `${window.location.origin}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return { success: false, error: mapSupabaseError(error) }
    }

    if (!data.url) {
      return { success: false, error: mapSupabaseError(new Error('No OAuth URL returned')) }
    }

    return { success: true, data: { url: data.url } }
  } catch (error) {
    return { success: false, error: mapSupabaseError(error) }
  }
}

/**
 * Retrieve the current authenticated session, if any.
 *
 * The returned session (when present) is converted to the module's AuthSession shape.
 *
 * @returns An AuthResult whose `data` is the mapped AuthSession when a session exists, `null` when no session exists. On failure `success` is `false` and `error` contains a mapped error.
 */
export async function getSession(): Promise<AuthResult<AuthSession | null>> {
  try {
    const supabase = getBrowserSupabaseClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { success: false, error: mapSupabaseError(error) }
    }

    if (!data.session) {
      return { success: true, data: null }
    }

    return { success: true, data: mapSession(data.session) }
  } catch (error) {
    return { success: false, error: mapSupabaseError(error) }
  }
}

/**
 * Retrieve the currently authenticated user from the active session.
 *
 * If no session or user exists, resolves successfully with `data: null`. If an authentication error
 * indicating "not authenticated" occurs, it is treated as success with `data: null`. Other errors
 * are returned as failures in the `AuthResult`.
 *
 * @returns The mapped `AuthUser` from the active session, or `null` if there is no authenticated user.
 */
export async function getUser(): Promise<AuthResult<AuthUser | null>> {
  try {
    const supabase = getBrowserSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      // getUser returns error if not authenticated - this is expected
      if (error.message?.includes('not authenticated')) {
        return { success: true, data: null }
      }
      return { success: false, error: mapSupabaseError(error) }
    }

    if (!data.user) {
      return { success: true, data: null }
    }

    return { success: true, data: mapUser(data.user) }
  } catch (error) {
    return { success: false, error: mapSupabaseError(error) }
  }
}

/**
 * Signs out the current user.
 *
 * @param options.scope - Scope of sign-out: `'local'` clears only the current session, `'global'` invalidates all sessions.
 * @returns An AuthResult whose `data` is `undefined` on success; on failure `error` contains the mapped Supabase error.
 */
export async function signOut(
  options: { scope?: 'local' | 'global' } = {}
): Promise<AuthResult<void>> {
  try {
    const supabase = getBrowserSupabaseClient()
    const { error } = await supabase.auth.signOut({
      scope: options.scope ?? 'local'
    })

    if (error) {
      return { success: false, error: mapSupabaseError(error) }
    }

    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: mapSupabaseError(error) }
  }
}

/**
 * Subscribe to authentication state changes and invoke the callback with a mapped session.
 *
 * @param callback - Invoked whenever auth state changes with the current `AuthSession` or `null` when there is no active session
 * @returns A function that unsubscribes the auth state listener
 */
export function onAuthStateChange(
  callback: (session: AuthSession | null) => void
): () => void {
  const supabase = getBrowserSupabaseClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event: AuthChangeEvent, session: Session | null) => {
      callback(session ? mapSession(session) : null)
    }
  )

  return () => subscription.unsubscribe()
}