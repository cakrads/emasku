import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/applications/shared/auth/supabase.server'

/**
 * OAuth Callback Handler
 * 
 * Handles the redirect from OAuth providers (Google).
 * Exchanges the auth code for a session and redirects to dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // UU PDP: Sync user and record initial mandatory consents
        const { userService } = await import('@/applications/shared/auth/user.service')
        const { consentService } = await import('@/applications/shared/privacy/consent.service')

        await userService.syncUser({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name
        })

        // Record initial consents
        await consentService.recordInitialConsents(user.id, {
          version: 'v1.0',
          ip: request.headers.get('x-forwarded-for') || undefined,
          userAgent: request.headers.get('user-agent') || undefined
        })
      }

      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // OAuth failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
