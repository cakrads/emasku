/**
 * Prices History Skeleton
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'

export function PricesHistorySkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 mb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" /> {/* Larger for Hero Price */}
        <Skeleton className="h-6 w-48 rounded-full" /> {/* Rounded for Pill */}
      </div>

      <div className="bg-card rounded-lg border border-border p-6 h-[400px] flex items-center justify-center">
        <Stack gap="lg" className="w-full h-full">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="flex-1 flex items-end gap-2">
            {[60, 40, 75, 50, 80, 55, 90].map((height, i) => (
              <Skeleton key={i} className={`flex-1 rounded-t h-[${height}%]`} />
            ))}
          </div>
        </Stack>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  )
}

import { Stack } from '@/frontend/components/ui/layout'
