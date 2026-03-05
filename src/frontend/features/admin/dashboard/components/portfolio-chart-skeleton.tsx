import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'

export function PortfolioChartSkeleton() {
  return (
    <Stack className="w-full">
      {/* Chart Header */}
      <Stack direction="horizontal" gap="md" className="items-center justify-between mb-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-32" />
      </Stack>

      {/* Chart Area */}
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </Stack>
  )
}
