'use client'

import { useLanguage } from '@/frontend/hooks/use-language'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'

export function ProofSection() {
  const { t } = useLanguage()

  const metrics = [
    { key: 'users', label: t('landing.proof.users'), value: t('landing.proof.usersValue') },
    { key: 'holdings', label: t('landing.proof.holdings'), value: t('landing.proof.holdingsValue') },
    { key: 'tracked', label: t('landing.proof.tracked'), value: t('landing.proof.trackedValue') },
  ]

  return (
    <section className="py-16 border-y border-border bg-surface">
      <Stack className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 text-center">
          {metrics.map((metric) => (
            <Stack key={metric.key} gap="xs" className="items-center">
              <Typography variant="h2" as="p" className="text-2xl md:text-3xl font-semibold text-foreground">
                {metric.value}
              </Typography>
              <Typography variant="caption" as="p" className="text-muted-foreground text-xs uppercase tracking-widest">
                {metric.label}
              </Typography>
            </Stack>
          ))}
        </div>
      </Stack>
    </section>
  )
}
