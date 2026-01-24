'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex justify-center items-start pt-16 md:pt-20 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Spotlight/Aurora (Subtle) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Tagline Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border backdrop-blur-sm animate-fade-in">
            <span className="text-accent-gold">✨</span>
            <span className="text-muted-foreground text-sm font-medium">{t('landing.hero.tagline')}</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 animate-fade-in-up">
          Catat emasmu.<br />
          <span className="text-accent-gold">Nilainya mengikuti market.</span><br />
          Tanpa ribet.
        </h1>

        {/* Subheadline */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100">
          {t('landing.hero.subheadline')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <Button asChild variant="solid" color="primary" size="lg" rounded="xl" className="min-w-[200px] animate-glow-pulse">
            <Link href={ROUTES.LOGIN}>{t('landing.hero.cta')}</Link>
          </Button>
          <Button asChild variant="outline" color="primary" size="lg" className="min-w-[200px] group">
            <a href="#cara-kerja" className="flex items-center gap-2">
              {t('landing.hero.secondary')}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-y-1"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

