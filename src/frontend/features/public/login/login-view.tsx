'use client'

/**
 * Login View
 * 
 * Login page with Guest and Google login options.
 * Follows UI architecture rules - uses primitives from components/ui.
 */

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Chrome, AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'
import { loginWithGoogle, recordConsent } from '@/frontend/services/auth/auth.api'
import { useAuthStore } from '@/frontend/providers/auth.store'
import { ROUTES } from '@/frontend/config/routes'
import { Checkbox } from '@/frontend/components/ui/checkbox'
import { Label } from '@/frontend/components/ui/label'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { toast } from 'sonner'

export function LoginView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setSession = useAuthStore((state) => state.setSession)

  const { t, language, setLanguage } = useLanguage()
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const [error, setError] = useState<{ userMessage: string; recoveryAction?: string } | null>(null)

  // Use session from auth store
  const session = useAuthStore((state) => state.session)

  // Redirect if already authenticated
  useEffect(() => {
    if (session?.user) {
      router.replace(ROUTES.DASHBOARD)
    }
  }, [session, router])

  // Handle errors from redirect (e.g. Server 500 caught by try-catch)
  useEffect(() => {
    const errorParam = searchParams.get('error')

    if (errorParam === 'oauth_failed') {
      toast.error(t('login.error.oauthFailed'), {
        duration: 5000,
      })
      setError({
        userMessage: t('login.error.oauthFailed')
      })
    } else if (errorParam === 'auth_callback_error') {
      toast.error(t('login.error.serverConfig'), {
        description: "Configuration Error on Vercel. Please unset 'logs' writing or check environment variables.",
        duration: 8000,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      })
      setError({
        userMessage: "Server configuration error. Contact administrator."
      })
    }
  }, [searchParams, t])


  const handleGoogleLogin = async () => {
    if (!hasConsented) {
      setError({ userMessage: t('login.error.consentRequired') })
      return
    }

    setIsLoadingGoogle(true)
    setError(null)

    const result = await loginWithGoogle()

    if (result.success) {
      // Pass consent to callback via state or local storage
      localStorage.setItem('emasku_user_consent_given', 'true')
      // OAuth will redirect to callback URL
      window.location.href = result.data.url
    } else {
      setError(result.error)
      setIsLoadingGoogle(false)
    }
  }

  const isLoading = isLoadingGoogle

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-accent-gold/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-accent-gold rounded-full" />
          </div>
          <CardTitle>
            <Typography variant="h2">{t('login.title')}</Typography>
          </CardTitle>
          <CardDescription>
            <Typography variant="body-sm">
              {t('login.subtitle')}
            </Typography>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Stack gap="md">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <Typography variant="body" className="font-medium text-sm">
                    {error.userMessage}
                  </Typography>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-muted ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all cursor-pointer">
              <Checkbox
                id="consent"
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                className="mt-0.5"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('login.privacyConsent')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('login.privacyDescription').split('{link}').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <a href="/privacy" className="text-accent-gold hover:underline" target="_blank">
                          {t('login.privacyLink')}
                        </a>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            <Button
              variant="solid"
              size="lg"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoadingGoogle ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Chrome className="h-5 w-5 mr-2" />
              )}
              {t('login.googleLogin')}
            </Button>

            <div className="mt-4 p-4 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
              <Shield className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{t('login.securityTitle')}</p>
                <p className="text-xs leading-relaxed opacity-90">
                  {t('login.securityDesc')}
                </p>
              </div>
            </div>

            <Typography variant="caption" className="text-center text-muted-foreground mt-4 italic">
              {t('login.tagline')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

    </div>
  )
}
