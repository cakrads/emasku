/**
 * Supabase Server Client Module
 * 
 * Server-only Supabase client.
 * Uses next/headers for cookie access - only works in Server Components/Route Handlers.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '../lib/env'

/**
 * Create and return a Supabase client configured for server-side use with cookie-backed session handling.
 *
 * Must be called within a request context that provides access to cookies (e.g., a Next.js server component or route handler).
 *
 * The client is initialized with the module's Supabase URL and public key and uses the request's cookie store to
 * read and write authentication cookies. If cookie writes fail (for example, when invoked from a Server Component),
 * those write errors are silently ignored to allow middleware-driven session refresh patterns.
 *
 * @returns A Supabase client instance configured for server-side usage and cookie-based authentication.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}