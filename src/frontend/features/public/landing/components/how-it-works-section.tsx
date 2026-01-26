'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { useEffect, useRef, useState, useCallback } from 'react'
import { FileText, TrendingUp, ShieldCheck } from 'lucide-react'
import { PhoneMock } from './phone-mock'
import { useIsMobile } from '@/frontend/hooks/use-mobile'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'

const steps = [
  { key: 'record', Icon: FileText, color: 'text-accent-gold', bg: 'bg-accent-gold/10', gradientBg: 'from-accent-gold to-amber-600' },
  { key: 'track', Icon: TrendingUp, color: 'text-accent-gold', bg: 'bg-accent-gold/10', gradientBg: 'from-accent-gold to-amber-600' },
  { key: 'grow', Icon: ShieldCheck, color: 'text-accent-gold', bg: 'bg-accent-gold/10', gradientBg: 'from-accent-gold to-amber-600' },
]

export function HowItWorksSection() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const isMobile = useIsMobile()

  // Mobile swipe state
  const [mobileActiveStep, setMobileActiveStep] = useState(0)
  const touchStartX = useRef(0)

  // Desktop: Intersection Observer scroll behavior (kept from original)
  useEffect(() => {
    if (isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setActiveStep(index)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    stepsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isMobile])

  // Mobile: Swipe handling
  const handleMobileSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left' && mobileActiveStep < 2) {
      setMobileActiveStep(prev => prev + 1)
    } else if (direction === 'right' && mobileActiveStep > 0) {
      setMobileActiveStep(prev => prev - 1)
    }
  }, [mobileActiveStep])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 50) {
      handleMobileSwipe(diff > 0 ? 'left' : 'right')
    }
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <section id="cara-kerja" className="py-16 px-4 relative overflow-hidden bg-background">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

        <div className="container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t('landing.howItWorks.title') || 'Cara Kerja Emasku'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t('landing.howItWorks.subtitle') || 'Sederhana. Transparan. Aman.'}
            </p>
          </div>

          {/* Mobile phone mock with swipe */}
          <div
            className="flex justify-center mb-8"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <PhoneMock activeStep={mobileActiveStep} className="scale-90" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setMobileActiveStep(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  mobileActiveStep === index
                    ? "w-6 bg-accent-gold"
                    : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {/* Active step content */}
          <div className="text-center max-w-sm mx-auto">
            <div className={cn(
              "inline-flex w-10 h-10 rounded-xl items-center justify-center font-bold text-sm mb-4 bg-gradient-to-br text-white shadow-lg",
              steps[mobileActiveStep].gradientBg
            )}>
              0{mobileActiveStep + 1}
            </div>
            <h3 className="text-xl font-bold mb-3">
              {t(`landing.howItWorks.steps.${steps[mobileActiveStep].key}.title`)}
            </h3>
            <p className="text-muted-foreground mb-2">
              {t(`landing.howItWorks.steps.${steps[mobileActiveStep].key}.description`)}
            </p>
          </div>

          {/* Exit CTA */}
          <div className="text-center mt-12 pt-8 border-t border-border/30">
            <p className="text-muted-foreground mb-4">
              Mulai dengan satu catatan emas.<br />
              Sisanya akan mengikuti.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-accent-gold to-amber-600 hover:from-amber-600 hover:to-accent-gold text-white shadow-lg shadow-accent-gold/30">
              <Link href={ROUTES.LOGIN}>
                {t('landing.howItWorks.cta.button') || 'Mulai Mencatat'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Desktop Layout - Scroll-driven sticky viewport
  return (
    <section
      id="cara-kerja"
      className="relative min-h-[250vh]"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

      {/* Sticky viewport that stays fixed while scrolling through section */}
      <div className="sticky top-0 h-screen flex items-center bg-gray-50 dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Phone Mockup */}
            <div className="hidden lg:flex justify-center">
              <PhoneMock activeStep={activeStep} />
            </div>

            {/* Right Column: Step Content */}
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t('landing.howItWorks.title') || 'Cara Kerja Emasku'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t('landing.howItWorks.subtitle') || 'Sederhana. Transparan. Aman.'}
                </p>
              </div>

              {steps.map((step, index) => (
                <div
                  key={step.key}
                  ref={(el) => { stepsRef.current[index] = el }}
                  data-index={index}
                  className={cn(
                    "transition-all duration-500 p-6 rounded-2xl border",
                    activeStep === index
                      ? "bg-card/80 backdrop-blur-sm border-accent-gold/20 shadow-lg opacity-100"
                      : "border-transparent opacity-40"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300",
                      activeStep === index
                        ? `bg-gradient-to-br ${step.gradientBg} text-white shadow-lg`
                        : "bg-muted text-muted-foreground"
                    )}>
                      0{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-xl font-bold mb-2 transition-colors duration-300",
                        activeStep === index ? step.color : ""
                      )}>
                        {t(`landing.howItWorks.steps.${step.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground">
                        {t(`landing.howItWorks.steps.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Exit CTA (visible when on last step) */}
              <div className={cn(
                "pt-8 border-t border-border/30 transition-all duration-500",
                activeStep === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
                <p className="text-muted-foreground mb-4">
                  Mulai dengan satu catatan emas.<br />
                  Sisanya akan mengikuti.
                </p>
                <Button size="lg" asChild className="bg-gradient-to-r from-accent-gold to-amber-600 hover:from-amber-600 hover:to-accent-gold text-white shadow-lg shadow-accent-gold/30">
                  <Link href={ROUTES.LOGIN}>
                    {t('landing.howItWorks.cta.button') || 'Mulai Mencatat'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invisible scroll triggers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[40vh]" />
        {steps.map((step, index) => (
          <div
            key={step.key}
            ref={(el) => { stepsRef.current[index] = el }}
            data-index={index}
            className="h-[60vh]"
          />
        ))}
      </div>
    </section>
  )
}

