'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Typography } from '@/frontend/components/ui/typography'

export function ProofSection() {
  const { t } = useLanguage()

  const metrics = [
    { key: 'users', label: t('landing.proof.users'), value: t('landing.proof.usersValue') },
    { key: 'holdings', label: t('landing.proof.holdings'), value: t('landing.proof.holdingsValue') },
    { key: 'tracked', label: t('landing.proof.tracked'), value: t('landing.proof.trackedValue') },
  ]

  return (
    <section className="py-16 border-y border-gray-200 dark:border-zinc-800/40 bg-gray-50 dark:bg-zinc-900/80">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {metrics.map((metric) => (
            <div key={metric.key} className="space-y-1">
              <Typography variant="h2" className="text-2xl md:text-3xl font-semibold text-foreground">
                {metric.value}
              </Typography>
              <Typography variant="caption" className="text-muted-foreground text-xs uppercase tracking-widest">
                {metric.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
