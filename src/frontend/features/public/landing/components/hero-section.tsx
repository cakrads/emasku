'use client'

import React from 'react'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { useScrollParallax, useScrollAnimation } from '@/frontend/hooks/use-scroll-animation'
import { HeroBackground } from './hero-background'
import { cn } from '@/frontend/utils/cn'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

export function HeroSection() {
  const { t } = useLanguage()
  const scrollY = useScrollParallax()

  // Scroll animations for content with stagger
  const tagline = useScrollAnimation({ threshold: 0.1 })
  const headline = useScrollAnimation({ threshold: 0.1 })
  const subheadline = useScrollAnimation({ threshold: 0.1 })
  const ctas = useScrollAnimation({ threshold: 0.1 })

  // Calculate opacity and transform for scroll effect
  // Matching values from example-landing/HeroSection.tsx for perfect feel
  // Opacity fades out based on 600px scroll
  const contentOpacity = Math.max(0, 1 - scrollY / 600)
  // Parallax moves at 0.3x speed
  const contentTranslate = scrollY * 0.3

  return (
    <section className="relative min-h-screen flex justify-center items-center overflow-hidden bg-white dark:bg-zinc-950 pt-16">
      {/* Rich Parallax Background */}
      <HeroBackground />

      {/* Content with Parallax */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center will-change-transform -mt-24 md:-mt-40"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentTranslate}px)`
        }}
      >
        {/* Tagline Badge */}
        <div
          ref={tagline.ref as React.RefObject<HTMLDivElement>}
          className={cn(
            "flex justify-center mb-8 transition-all duration-700 ease-out",
            tagline.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-border backdrop-blur-md shadow-sm">
            <span className="text-accent-gold">✨</span>
            <Typography variant="body-sm" as="span" className="text-muted-foreground text-sm font-medium">{t('landing.hero.tagline')}</Typography>
          </div>
        </div>

        {/* Headline */}
        <h1
          ref={headline.ref as React.RefObject<HTMLHeadingElement>}
          className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 transition-all duration-700 ease-out delay-100",
            headline.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {t('landing.hero.headline').split('\n').map((line: string, i: number) => (
            <React.Fragment key={i}>
              {line.includes('market') || line.includes('Market-synced') ? (
                <span className="text-accent-gold">{line}</span>
              ) : (
                line
              )}
              {i < t('landing.hero.headline').split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadline.ref as React.RefObject<HTMLParagraphElement>}
          className={cn(
            "text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 ease-out delay-200",
            subheadline.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {t('landing.hero.subheadline')}
        </p>

        {/* CTAs */}
        <div
          ref={ctas.ref as React.RefObject<HTMLDivElement>}
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out delay-300",
            ctas.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <Button asChild variant="solid" color="primary" size="lg" rounded="xl" className="min-w-[200px] animate-glow-pulse shadow-gold">
            <Link href={ROUTES.LOGIN}>{t('landing.hero.cta')}</Link>
          </Button>
          <Button asChild variant="outline" color="primary" size="lg" className="min-w-[200px] group bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-900/80 border-accent-gold/20">
            <a href="#cara-kerja" className="flex items-center gap-2">
              {t('landing.hero.secondary')}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-y-1"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
            </a>
          </Button>
        </div>
      </div>

      {/* Bottom Fade Gradient for Smooth Transition - Updated to match Price Section background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-20" />
    </section>
  )
}
