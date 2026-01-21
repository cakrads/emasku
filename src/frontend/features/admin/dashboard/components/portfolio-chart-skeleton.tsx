import { Skeleton } from '@/frontend/components/ui/skeleton'

export function PortfolioChartSkeleton() {
  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Chart Area */}
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </div>
  )
}
