'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Shield, LineChart, Lock } from 'lucide-react'
import { ScrollReveal } from '@/frontend/components/ui/scroll-reveal'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

const reasons = [
  { key: 'trust', Icon: Shield },
  { key: 'clarity', Icon: LineChart },
  { key: 'privacy', Icon: Lock },
]

export function WhySection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-900/80">
      <Stack className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={800} threshold={0.2} className="text-center mb-16">
          <Typography variant="h2" as="h2" className="text-2xl md:text-3xl font-semibold text-foreground">
            {t('landing.why.title')}
          </Typography>
          <Typography variant="body" as="p" className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
            {t('landing.why.subtitle')}
          </Typography>
        </ScrollReveal>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map(({ key, Icon }, index) => (
            <ScrollReveal
              key={key}
              direction="up"
              duration={800}
              delay={300 + (index * 150)}
              distance={40}
              className="h-full"
            >
              <Stack className="text-center p-6 rounded-2xl border border-transparent hover:border-border/40 transition-colors duration-300 h-full">
                <Stack className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-gold/5 text-accent-gold mb-6">
                  <Icon className="w-6 h-6" />
                </Stack>
                <Typography variant="h3" as="h3" className="text-lg font-semibold text-foreground mb-3">
                  {t(`landing.why.reasons.${key}.title`)}
                </Typography>
                <Typography variant="body-sm" as="p" className="text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.why.reasons.${key}.description`)}
                </Typography>
              </Stack>
            </ScrollReveal>
          ))}
        </div>
      </Stack>
    </section>
  )
}
