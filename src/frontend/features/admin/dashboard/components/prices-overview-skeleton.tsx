/**
 * Market Overview Skeleton
 * 
 * Loading state for market today cards.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'

export function PricesOverviewSkeleton() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex flex-col">
          <Typography as="h2" variant="h3">{t('dashboard.marketToday')}</Typography>
          <Typography variant="caption" className="text-(--text-muted)">
            {t('dashboard.marketTodaySubtitle')}
          </Typography>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-3 pb-1">
          {/* Matches prices-today-cards.tsx logic: Only 3 visible items on mobile, others hidden */}
          {[1, 2, 3, 4, 5].map((i, index) => (
            <div
              key={i}
              className={cn(
                "flex flex-col justify-between p-3 rounded-xl border border-border bg-card h-[100px] shrink-0",
                index >= 3 ? "hidden md:flex" : "flex"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-4" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="flex items-center">
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
            </div>
          ))}

          {/* View All placeholder match - Always visible */}
          <div className="flex items-center justify-center p-3 rounded-xl border border-dashed border-border h-[100px] lg:h-[80px]">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
