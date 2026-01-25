/**
 * Portfolio Summary Skeleton
 * 
 * Loading state for the portfolio hero section.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

export function PortfolioSummarySkeleton() {
  const { t } = useLanguage()

  return (
    <Stack gap="md" className="min-h-auto md:min-h-[190px]">
      <Stack gap="xs">
        <Typography variant="h4" className='mb-2'>{t('dashboard.portfolioValue')}</Typography>
        {/* Main Value - Matches text-5xl md:text-5xl (48px height) */}
        <Skeleton className="h-12 w-48 md:w-80 mb-2" />

        {/* Context Note placeholder */}
        <Typography variant="caption" className="text-(--text-muted) opacity-60">
          {t('dashboard.estimationContext')}
        </Typography>
      </Stack>

      {/* Stats Row - Only All Time (Today is hidden per user feedback) */}
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-baseline gap-2">
          <Typography variant="body-sm" className="text-(--text-muted)">
            {t('dashboard.allTime')}:
          </Typography>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Stack>
  )
}
