import { Skeleton } from '@/frontend/components/ui/skeleton'

export function PricesHistorySkeleton() {
  return (
    <div className="flex flex-col">
      {/* Current Price Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col gap-1">
          {/* Description */}
          <Skeleton className="h-4 w-48 mb-1" />

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-10 w-64 md:h-12" />
          </div>

          {/* Price Context */}
          <Skeleton className="h-4 w-56 mt-1" />

          {/* Status Pill */}
          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-7 w-64 rounded-full" />
          </div>
        </div>
      </div>

      {/* Range Selector Skeleton */}
      <div className="flex p-1 bg-muted/50 rounded-lg items-center gap-1 w-fit mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-1.5">
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>

      {/* Chart Section Skeleton */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-2 md:p-6 mb-8 h-[416px] md:h-[448px] flex items-end justify-center overflow-hidden">
        <div className="w-full h-full flex items-end gap-2 animate-pulse px-4 pb-8">
          {[60, 40, 75, 50, 80, 55, 90, 65, 45, 70, 55, 85].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-muted/50 rounded-t-md"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* Footer Note Skeleton */}
      <div className="text-center px-4">
        <div className="flex flex-col items-center">
          <Skeleton className="h-4 w-full max-w-[400px]" />
        </div>
      </div>
    </div>
  )
}
