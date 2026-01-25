/**
 * Holdings List Skeleton
 */

import { Stack } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'

export function HoldingsListSkeleton() {
  return (
    <Stack gap="sm">
      {/* 1. Action Bar Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      {/* 2. Portfolio Summary Skeleton (Single Wide Card) */}
      <div>
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 h-[129px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 3. Table Skeleton (Holdings List) */}
      <div className="py-6">
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <div className="w-full">
              {/* Header */}
              <div className="flex items-center border-b border-border py-3 px-4 gap-4 bg-transparent">
                <Skeleton className="h-4 w-24" /> {/* Date */}
                <Skeleton className="h-4 w-20" /> {/* Weight */}
                <Skeleton className="h-4 w-24 ml-auto" /> {/* Buy Price */}
                <Skeleton className="h-4 w-24 ml-auto" /> {/* Current Value */}
                <Skeleton className="h-4 w-20 ml-auto" /> {/* PnL */}
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex border-b border-border py-4 px-4 gap-4 items-center">
                    {/* Date + Duration */}
                    <div className="w-1/5 flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>

                    {/* Weight + Brand */}
                    <div className="w-1/5 flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Buy Price */}
                    <div className="w-1/5 ml-auto flex justify-end">
                      <Skeleton className="h-4 w-28" />
                    </div>

                    {/* Current Value */}
                    <div className="w-1/5 ml-auto flex justify-end">
                      <Skeleton className="h-4 w-28 font-medium" />
                    </div>

                    {/* PnL + % */}
                    <div className="w-1/5 ml-auto flex flex-col items-end gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-2">
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Stack>
  )
}
