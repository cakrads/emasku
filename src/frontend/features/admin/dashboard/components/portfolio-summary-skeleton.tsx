/**
 * Portfolio Summary Skeleton
 *
 * Loading state for the portfolio hero section.
 * IMPORTANT: Heights must match portfolio-hero.tsx to prevent CLS.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, Divider } from '@/frontend/components/ui/layout'
import { useLanguage } from '@/frontend/hooks/use-language'

export function PortfolioSummarySkeleton() {
  const { t } = useLanguage()

  return (
    <Stack className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50">
      <Stack gap="md">
        {/* Header section - matches portfolio-hero mb-6 */}
        <Stack gap="sm" className="mb-6">
          {/* Portfolio Value label */}
          <Skeleton className="h-4 w-48 mb-1 bg-teal-200/50 dark:bg-teal-800/50" />

          {/* Main Value */}
          <Skeleton className="h-12 md:h-14 w-48 md:w-72 mb-2 bg-teal-200/50 dark:bg-teal-800/50" />

          {/* PnL Row */}
          <Stack direction="horizontal" gap="sm" className="items-center mb-2">
            <Skeleton className="h-5 w-20 bg-teal-200/50 dark:bg-teal-800/50" />
            <Divider direction="vertical" className="h-4 opacity-50" />
            <Skeleton className="h-5 w-32 bg-teal-200/50 dark:bg-teal-800/50" />
          </Stack>

          {/* Context note */}
          <Skeleton className="h-3 w-64 bg-teal-200/30 dark:bg-teal-800/30" />
        </Stack>

        {/* Periodic Metrics - Horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <Stack
              key={i}
              className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-3 md:p-4 border border-teal-100 dark:border-teal-900 backdrop-blur-sm min-w-[120px] md:min-w-0 shrink-0 md:shrink"
            >
              {/* Period label */}
              <Skeleton className="h-3 w-10 mb-1 bg-teal-200/50 dark:bg-teal-800/50" />
              {/* Value */}
              <Skeleton className="h-4 w-16 mb-1 bg-teal-200/50 dark:bg-teal-800/50" />
              {/* Percentage */}
              <Skeleton className="h-3 w-10 bg-teal-200/30 dark:bg-teal-800/30" />
            </Stack>
          ))}
        </div>
      </Stack>
    </Stack>
  )
}
