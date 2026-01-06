/**
 * Portfolio Summary Skeleton
 * 
 * Loading state for the portfolio hero section.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'

export function PortfolioSummarySkeleton() {
  return (
    <Stack gap="md" className="min-h-auto md:min-h-[190px]">
      <Stack gap="xs">
        <Typography variant="h4" className='mb-2'>Portfolio Value</Typography>
        {/* Main Value */}
        <Skeleton className="h-10 md:h-12 w-48 md:w-64 mb-1" />
      </Stack>

      {/* Stats Row */}
      <Stack direction="horizontal" gap="md" className="items-center flex-wrap">
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Skeleton className="h-4 w-16" />
          <Typography variant="caption" className="text-(--text-muted)">all time</Typography>
        </Stack>

        <Divider direction="vertical" className="h-4" />

        <Stack direction="horizontal" gap="sm" className="items-center">
          <Skeleton className="h-4 w-16" />
          <Typography variant="caption" className="text-(--text-muted)">today</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
