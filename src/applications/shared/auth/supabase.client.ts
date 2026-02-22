/**
 * Supabase Browser Client Module
 * 
 * Browser-only Supabase client singleton.
 * Uses @supabase/ssr for proper cookie handling.
 */

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '../lib/env'

/**
 * Create and return a Supabase client configured for browser usage.
 *
 * @returns A Supabase browser client instance configured with `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
}

/**
 * Browser client singleton for client components
 */
let browserClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Get the singleton browser Supabase client, initializing it on first access.
 *
 * @returns The singleton browser Supabase client instance configured with the module's environment values.
 */
export function getBrowserSupabaseClient() {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}