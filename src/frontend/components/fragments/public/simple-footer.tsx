'use client'

import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Typography } from '@/frontend/components/ui/typography'

export function SimpleFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="py-8 px-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:max-w-7xl text-xs text-muted-foreground/60">
        {/* Brand */}
        <div className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-5 h-5 bg-accent-gold rounded-full" />
          <span className="font-semibold text-foreground tracking-tight">Emasku</span>
        </div>

        {/* Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <nav className="flex gap-4">
            <Link
              href={ROUTES.PRICES}
              className="hover:text-foreground transition-colors"
            >
              {t('landing.footer.prices')}
            </Link>
            <Link
              href={ROUTES.PRIVACY_POLICY || '/privacy'}
              className="hover:text-foreground transition-colors"
            >
              {t('landing.footer.privacy')}
            </Link>
          </nav>
          <p>
            {t('landing.footer.copyright').replace('{year}', year.toString())}
          </p>
        </div>
      </div>
    </footer>
  )
}
