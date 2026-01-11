'use client'

/**
 * Login View
 * 
 * Login page with Guest and Google login options.
 * Follows UI architecture rules - uses primitives from components/ui.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Chrome, AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'
import { loginAsGuest, loginWithGoogle, recordConsent } from '@/frontend/services/auth/auth.api'
import { useAuthStore } from '@/frontend/providers/auth.store'
import { ROUTES } from '@/frontend/config/routes'
import type { AuthError } from '@/applications/shared/auth'
import { Checkbox } from '@/frontend/components/ui/checkbox'
import { Label } from '@/frontend/components/ui/label'

export function LoginView() {
  const router = useRouter()
  const setSession = useAuthStore((state) => state.setSession)

  const [isLoadingGuest, setIsLoadingGuest] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const [error, setError] = useState<{ userMessage: string; recoveryAction?: string } | null>(null)

  const handleGuestLogin = async () => {
    if (!hasConsented) {
      setError({ userMessage: 'Anda harus menyetujui Kebijakan Privasi untuk melanjutkan.' })
      return
    }

    setIsLoadingGuest(true)
    setError(null)

    const result = await loginAsGuest()

    if (result.success) {
      setSession(result.data)

      // UU PDP: Record initial mandatory consents for guest
      await recordConsent({
        purposes: ['ACCOUNT_CREATION', 'PORTFOLIO_ANALYTICS'],
        version: 'v1.0'
      })

      router.push(ROUTES.DASHBOARD)
    } else {
      setError(result.error)
    }

    setIsLoadingGuest(false)
  }

  const handleGoogleLogin = async () => {
    if (!hasConsented) {
      setError({ userMessage: 'Anda harus menyetujui Kebijakan Privasi untuk melanjutkan.' })
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

  const isLoading = isLoadingGuest || isLoadingGoogle

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-accent-gold/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-accent-gold rounded-full" />
          </div>
          <CardTitle>
            <Typography variant="h2">Selamat Datang</Typography>
          </CardTitle>
          <CardDescription>
            <Typography variant="body-sm">
              Masuk untuk melacak portofolio emas Anda
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
                  Saya menyetujui Kebijakan Privasi
                </Label>
                <p className="text-xs text-muted-foreground">
                  Saya memberikan izin kepada Emasku untuk memproses data pribadi saya sesuai dengan{' '}
                  <a href="/privacy" className="text-accent-gold hover:underline" target="_blank">
                    Kebijakan Privasi UU PDP
                  </a>.
                </p>
              </div>
            </div>

            <Button
              variant="default"
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
              Masuk dengan Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              {isLoadingGuest ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )}
              Lanjutkan sebagai Tamu
            </Button>

            <div className="mt-4 p-4 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
              <Shield className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Jaminan Keamanan</p>
                <p className="text-xs leading-relaxed opacity-90">
                  Data Anda aman dan rahasia. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda.
                </p>
              </div>
            </div>

            <Typography variant="caption" className="text-center text-muted-foreground mt-4 italic">
              Emasku - Pencatat Investasi Emas Anda
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}
