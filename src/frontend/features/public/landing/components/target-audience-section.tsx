'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Wallet, TrendingUp, Users } from 'lucide-react'

const audiences = [
  { key: 'collector', Icon: Wallet },
  { key: 'investor', Icon: TrendingUp },
  { key: 'family', Icon: Users },
]

export function TargetAudienceSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground block mb-3">
            {t('landing.audience.title')}
          </h2>
          <p className="text-base text-foreground/70 max-w-lg mx-auto block">
            {t('landing.audience.subtitle')}
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map(({ key, Icon }) => (
            <div
              key={key}
              className="p-6 rounded-2xl border border-transparent hover:border-border/40 bg-card/10 hover:bg-card/30 transition-all duration-300"
            >
              <div className="mb-4 block">
                <Icon className="w-8 h-8 text-accent-gold" />
              </div>
              <h3 className="text-base font-semibold text-foreground block mb-2">
                {t(`landing.audience.types.${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground block">
                {t(`landing.audience.types.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
