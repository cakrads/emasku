/**
 * Supabase Browser Client Module
 * 
 * Browser-only Supabase client singleton.
 * Uses @supabase/ssr for proper cookie handling.
 */

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '../lib/env'

/**
 * Create a Supabase client for browser usage
 */
export function createBrowserSupabaseClient() {
  if (!SUPABASE_URL) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
  }
  return createBrowserClient(SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
}

/**
 * Browser client singleton for client components
 */
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getBrowserSupabaseClient() {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient()
  }
  return browserClient
}
