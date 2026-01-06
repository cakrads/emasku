/**
 * Holdings List Skeleton
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'

export function HoldingsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Bar Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div className="flex border-b border-border py-3 px-4 gap-4">
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5 ml-auto" />
            <Skeleton className="h-4 w-1/5 ml-auto" />
            <Skeleton className="h-4 w-10 ml-auto" />
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex border-b border-border py-4 px-4 gap-4 items-center">
              <div className="w-1/5">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="w-1/5">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="w-1/5 ml-auto flex justify-end">
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="w-1/5 ml-auto flex justify-end">
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="w-10 ml-auto flex justify-end">
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
