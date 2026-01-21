import { Stack, Section } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { PortfolioSummarySkeleton } from './portfolio-summary-skeleton'
import { PricesOverviewSkeleton } from './prices-overview-skeleton'
import { PortfolioChartSkeleton } from './portfolio-chart-skeleton'
import { BrandBreakdownSkeleton } from './brand-breakdown-skeleton'

export function DashboardSkeleton() {
  return (
    <Stack gap="xl">
      {/* Top Section */}
      <Stack gap="md">
        {/* Price Freshness Placeholder */}
        <div className="flex justify-end mb-4 lg:mb-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hero */}
          <div className="lg:col-span-2 min-h-auto md:min-h-[190px]">
            <PortfolioSummarySkeleton />
          </div>

          {/* Market Cards Wrapper - Matches DashboardView */}
          <div className="lg:col-span-1 lg:relative min-w-0">
            <div className="flex flex-col h-full lg:absolute lg:inset-0 w-full">
              <div className="flex-1 overflow-hidden min-h-0">
                <PricesOverviewSkeleton />
              </div>
            </div>
          </div>
        </div>
      </Stack>

      {/* Brand Breakdown Skeleton */}
      <BrandBreakdownSkeleton />

      {/* Chart Skeleton */}
      <PortfolioChartSkeleton />

      {/* Bottom Spacer */}
      <Section className="h-24 md:h-6" />
    </Stack>
  )
}
