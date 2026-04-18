'use client'

import { Plus, ArrowUpRight, BarChart2 } from 'lucide-react'
import { ActionChip } from '@/frontend/components/ui/action-chip'
import { Stack } from '@/frontend/components/ui/layout'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'

export function QuickActions() {
  const { t } = useLanguage()

  return (
    <Stack direction="horizontal" gap="sm" className="flex-nowrap overflow-x-auto pb-1 scrollbar-hide">
      <ActionChip
        variant="primary"
        icon={<Plus className="w-4 h-4" />}
        label={t('dashboard.addGoldHolding')}
        href={ROUTES.ADD_HOLDING}
        className="hidden md:flex"
      />
      <ActionChip
        variant="outline"
        icon={<ArrowUpRight className="w-4 h-4" />}
        label={t('dashboard.sell')}
        href={ROUTES.BUYBACK_SIMULATION}
      />
      <ActionChip
        variant="outline"
        icon={<BarChart2 className="w-4 h-4" />}
        label={t('dashboard.priceHistory')}
        href={ROUTES.PRICES_HISTORY}
      />
    </Stack>
  )
}
