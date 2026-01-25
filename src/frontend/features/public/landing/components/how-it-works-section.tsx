'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { useEffect, useRef, useState } from 'react'
import { FileText, TrendingUp, ShieldCheck } from 'lucide-react'

const steps = [
  { key: 'record', Icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'track', Icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  { key: 'grow', Icon: ShieldCheck, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
]

export function HowItWorksSection() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
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
  }, [])

  return (
    <section id="cara-kerja" className="py-24 bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('landing.howItWorks.title') || 'Cara Kerja Emasku'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.howItWorks.subtitle') || 'Sederhana. Transparan. Aman.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Sticky Phone Mockup */}
          <div className="hidden lg:block sticky top-32">
            <div className="relative w-[300px] h-[600px] mx-auto bg-zinc-950 rounded-[3rem] border-[14px] border-zinc-900 shadow-card overflow-hidden p-2">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-xl z-20" />

              {/* Phone Screen Content */}
              <div className="w-full h-full bg-card rounded-2xl flex flex-col relative overflow-hidden">
                {/* Dynamic content based on active step */}
                <div className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-8">
                  <div className={cn(
                    "w-full aspect-square rounded-full flex items-center justify-center mb-8 transition-transform duration-500",
                    steps[activeStep].bg
                  )}>
                    {(() => {
                      const Icon = steps[activeStep].Icon
                      return <Icon className={cn("w-20 h-20 transition-all duration-300", steps[activeStep].color)} />
                    })()}
                  </div>
                </div>

                {/* Mock UI Elements */}
                <div className="mt-auto space-y-3 p-4">
                  <div className="h-2 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-16 w-full bg-muted/50 rounded-xl" />
                  <div className="h-16 w-full bg-muted/50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Steps */}
          <div className="space-y-32 py-10">
            {steps.map((step, index) => (
              <div
                key={step.key}
                ref={(el) => { stepsRef.current[index] = el }}
                data-index={index}
                className={cn(
                  "transition-all duration-500 p-8 rounded-3xl border border-transparent",
                  activeStep === index
                    ? "bg-card border-border shadow-card scale-100 opacity-100 backdrop-blur-sm"
                    : "opacity-40 scale-95 grayscale hover:opacity-60 transition-opacity"
                )}
              >
                <div className={cn("inline-flex p-3 rounded-xl mb-6", step.bg)}>
                  <step.Icon className={cn("w-6 h-6", step.color)} />
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {t(`landing.howItWorks.steps.${step.key}.title`)}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(`landing.howItWorks.steps.${step.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
