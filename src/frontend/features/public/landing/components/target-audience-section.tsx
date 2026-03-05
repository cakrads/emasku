'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Wallet, TrendingUp, Users } from 'lucide-react'
import { ScrollReveal } from '@/frontend/components/ui/scroll-reveal'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

const audiences = [
  { key: 'collector', Icon: Wallet },
  { key: 'investor', Icon: TrendingUp },
  { key: 'family', Icon: Users },
]

export function TargetAudienceSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-zinc-950">
      <Stack className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={800} threshold={0.2} className="text-center mb-12">
          <Typography variant="h2" as="h2" className="text-2xl md:text-3xl font-semibold text-foreground block mb-3">
            {t('landing.audience.title')}
          </Typography>
          <Typography variant="body" as="p" className="text-base text-foreground/70 max-w-lg mx-auto block">
            {t('landing.audience.subtitle')}
          </Typography>
        </ScrollReveal>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map(({ key, Icon }, index) => (
            <ScrollReveal
              key={key}
              direction="up"
              duration={800}
              delay={200 + (index * 150)}
              distance={40}
              className="h-full"
            >
              <Stack
                className="p-6 rounded-2xl border border-transparent hover:border-border/40 bg-card/10 hover:bg-card/30 transition-all duration-300 h-full"
              >
                <Stack className="mb-4">
                  <Icon className="w-8 h-8 text-accent-gold" />
                </Stack>
                <Typography variant="h3" as="h3" className="text-base font-semibold text-foreground block mb-2">
                  {t(`landing.audience.types.${key}.title`)}
                </Typography>
                <Typography variant="body-sm" as="p" className="text-sm text-muted-foreground block">
                  {t(`landing.audience.types.${key}.description`)}
                </Typography>
              </Stack>
            </ScrollReveal>
          ))}
        </div>
      </Stack>
    </section>
  )
}
