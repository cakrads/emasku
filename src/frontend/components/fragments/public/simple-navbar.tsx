'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { ROUTES } from '@/frontend/config/routes'
import { Button } from '@/frontend/components/ui/button'
import { useLanguage } from '@/frontend/hooks/use-language'

export function SimpleNavbar() {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-gold rounded-full" />
          <span className="font-bold text-lg tracking-tight">Emasku</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Prices link */}
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.PRICES}>{t('navbar.prices')}</Link>
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Login button */}
          <Button asChild color="primary" size="sm">
            <Link href={ROUTES.LOGIN}>{t('common.login')}</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

