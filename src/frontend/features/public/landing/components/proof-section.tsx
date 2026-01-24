'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Typography } from '@/frontend/components/ui/typography'

const metrics = [
  { key: 'users', value: '1,200+' },
  { key: 'holdings', value: '8K+' },
  { key: 'tracked', value: 'Rp 99,9M+' },
]

export function ProofSection() {
  const { t } = useLanguage()

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
                {t(`landing.proof.${metric.key}`)}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
