/**
 * Portfolio Summary Skeleton
 *
 * Loading state for the portfolio hero section.
 * Heights must match portfolio-hero.tsx to prevent CLS.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'

export function PortfolioSummarySkeleton() {
  return (
    <Stack gap="sm">
      {/* Main value */}
      <Skeleton className="h-12 md:h-14 w-56 md:w-72" />
      {/* Period PnL */}
      <Skeleton className="h-4 w-36" />
      {/* Period tabs */}
      <Stack direction="horizontal" gap="none" className="items-center gap-x-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-3 w-12" />
        ))}
      </Stack>
      {/* Context */}
      <Skeleton className="h-3 w-52" />
    </Stack>
  )
}
