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
 * Map Supabase user to our AuthUser type
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
 * Map Supabase session to our AuthSession type
 */
function mapSession(session: Session): AuthSession {
  return {
    user: mapUser(session.user),
    accessToken: session.access_token,
    expiresAt: session.expires_at ?? 0,
  }
}

/**
 * Login as guest (anonymous sign-in)
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
 * Login with Google OAuth
 * Redirects to Google for authentication
 */
export async function loginWithGoogle(): Promise<AuthResult<{ url: string }>> {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: mapSupabaseError(new Error('loginWithGoogle can only be called in browser context'))
      }
    }

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
 * Get the current session
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
 * Get the current user (from session)
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
 * Sign out the current user
 * 
 * @param options.scope - 'local' clears only current session, 'global' invalidates all sessions
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
 * Subscribe to auth state changes
 * Returns an unsubscribe function
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
