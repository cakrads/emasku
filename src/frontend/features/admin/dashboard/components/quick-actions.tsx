'use client'

import { useRouter } from 'next/navigation'
import { Plus, ArrowUpRight, BarChart2 } from 'lucide-react'
import { ActionChip } from '@/frontend/components/ui/action-chip'
import { Stack } from '@/frontend/components/ui/layout'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'

export function QuickActions() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <Stack direction="horizontal" gap="sm" className="flex-nowrap overflow-x-auto pb-1 scrollbar-hide">
      <ActionChip
        variant="primary"
        icon={<Plus className="w-4 h-4" />}
        label={t('dashboard.addGoldHolding')}
        onClick={() => router.push(ROUTES.ADD_HOLDING)}
      />
      <ActionChip
        variant="outline"
        icon={<ArrowUpRight className="w-4 h-4" />}
        label={t('dashboard.sell')}
        onClick={() => router.push(ROUTES.BUYBACK_SIMULATION)}
      />
      <ActionChip
        variant="outline"
        icon={<BarChart2 className="w-4 h-4" />}
        label={t('dashboard.priceHistory')}
        onClick={() => router.push(ROUTES.PRICES_HISTORY)}
      />
    </Stack>
  )
}
