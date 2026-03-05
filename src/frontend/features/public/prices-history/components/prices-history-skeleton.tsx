import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'

export function PricesHistorySkeleton() {
  return (
    <Stack direction="vertical" gap="none">
      {/* Current Price Header Skeleton */}
      <Stack direction="vertical" className="mb-8">
        <Stack direction="vertical" gap="xs">
          {/* Description */}
          <Skeleton className="h-4 w-48 mb-1" />

          {/* Price */}
          <Stack direction="horizontal" gap="sm" className="items-baseline">
            <Skeleton className="h-10 w-64 md:h-12" />
          </Stack>

          {/* Price Context */}
          <Skeleton className="h-4 w-56 mt-1" />

          {/* Status Pill */}
          <Stack direction="horizontal" gap="sm" className="items-center mt-4">
            <Skeleton className="h-7 w-64 rounded-full" />
          </Stack>
        </Stack>
      </Stack>

      {/* Range Selector Skeleton - overflow-x-auto is an exception */}
      <div className="flex p-1 bg-muted/50 rounded-lg items-center gap-1 w-fit mb-6 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <Stack key={i} direction="horizontal" className="px-4 py-1.5">
            <Skeleton className="h-4 w-8" />
          </Stack>
        ))}
      </div>

      {/* Chart Section Skeleton - overflow-hidden is an exception */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-2 md:p-6 mb-8 h-[416px] md:h-[448px] flex items-end justify-center overflow-hidden">
        <Stack direction="horizontal" gap="sm" className="w-full h-full items-end animate-pulse px-4 pb-8">
          {[60, 40, 75, 50, 80, 55, 90, 65, 45, 70, 55, 85].map((height, i) => (
            <Stack
              key={i}
              direction="vertical"
              className="flex-1 bg-muted/50 rounded-t-md"
              style={{ height: `${height}%` }}
            />
          ))}
        </Stack>
      </div>

      {/* Footer Note Skeleton */}
      <Stack direction="horizontal" className="justify-center px-4">
        <Stack direction="vertical" className="items-center">
          <Skeleton className="h-4 w-full max-w-[400px]" />
        </Stack>
      </Stack>
    </Stack>
  )
}
