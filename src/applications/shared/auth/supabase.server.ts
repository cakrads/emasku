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
 * Create a Supabase client for server-side usage
 * Must be called within a request context (has access to cookies)
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
