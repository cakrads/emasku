/**
 * Market Overview Skeleton
 * 
 * Loading state for market today cards.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Typography } from '@/frontend/components/ui/typography'
import { ArrowRight } from 'lucide-react'

export function PricesOverviewSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Typography as="h2" variant="h3">Market Today</Typography>
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="w-6 h-6 rounded-full bg-muted/50 hidden lg:block" />
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-3 pb-1">
          {/* Single Card Skeleton */}
          {[1].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-3 rounded-xl border border-border bg-card h-[100px] shrink-0"
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
        </div>
      </div>
    </div>
  )
}
