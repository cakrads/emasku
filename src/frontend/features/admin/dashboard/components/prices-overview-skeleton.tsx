/**
 * Market Overview Skeleton
 * 
 * Loading state for market today cards.
 * IMPORTANT: Heights and grid must match prices-today-cards.tsx to prevent CLS.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { useLanguage } from '@/frontend/hooks/use-language'

export function PricesOverviewSkeleton() {
  const { t } = useLanguage()

  return (
    <div className="min-h-[180px] md:min-h-[170px]">
      {/* Header - matches prices-today-cards header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-4 w-32 hidden md:block" />
        <Skeleton className="h-4 w-4 md:hidden" />
      </div>

      {/* Horizontal Grid - matches grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Show 3 cards on mobile (2 visible + 1), 3 on tablet, 3 on desktop */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 rounded-xl border border-border bg-background h-[110px]"
          >
            {/* Brand name */}
            <Skeleton className="h-3 w-16" />

            {/* Price + Delta */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}


      </div>
    </div>
  )
}
