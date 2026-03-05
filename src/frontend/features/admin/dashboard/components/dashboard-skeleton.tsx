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
        <Stack className="justify-end mb-4 lg:mb-0">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </Stack>
        </Stack>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hero */}
          <Stack className="lg:col-span-2 min-h-auto md:min-h-[190px]">
            <PortfolioSummarySkeleton />
          </Stack>

          {/* Market Cards Wrapper - Matches DashboardView */}
          <Stack className="lg:col-span-1 lg:relative min-w-0">
            <div className="flex flex-col h-full lg:absolute lg:inset-0 w-full">
              <Stack className="flex-1 overflow-hidden min-h-0">
                <PricesOverviewSkeleton />
              </Stack>
            </div>
          </Stack>
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
