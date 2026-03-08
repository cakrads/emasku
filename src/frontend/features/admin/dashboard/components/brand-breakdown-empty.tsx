'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { Layers } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

export default function BrandBreakdownEmpty() {
  const { t } = useLanguage()
  return (
    <Stack gap="md">
      <SectionHeader title={t('dashboard.holdings')} />
      <div className="rounded-xl border border-dashed border-border bg-surface/50 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[140px]">
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
          <Layers className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <Typography variant="body-sm" className="text-muted-foreground max-w-xs">
          {t('dashboard.brandBreakdownEmptyDesc')}
        </Typography>
      </div>
    </Stack>
  )
}
