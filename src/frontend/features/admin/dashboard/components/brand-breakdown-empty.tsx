'use client'

import { Stack, ScrollArea } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Layers } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

export default function BrandBreakdownEmpty() {
  const { t } = useLanguage()
  return (
    <Stack gap="md">
      <Stack gap="none">
        <Typography as="h2" variant="h3">{t('dashboard.holdings')}</Typography>
        <Typography variant="body-sm">{t('dashboard.byBrand')}</Typography>
      </Stack>

      <ScrollArea>
        <Stack direction="horizontal" gap="md" className="pb-2">
          {/* Placeholder Card */}
          <div className="shrink-0 w-[280px] bg-(--surface-elevated) border border-dashed border-(--border) rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Layers className="w-6 h-6 text-muted-foreground" />
            </div>
            <Typography variant="body-sm" className="text-muted-foreground max-w-[200px]">
              {t('dashboard.brandBreakdownEmptyDesc')}
            </Typography>
          </div>
          <div className="w-2 shrink-0" />
        </Stack>
      </ScrollArea>
    </Stack>
  )
}
