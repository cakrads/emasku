import { Stack, Section } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { PortfolioSummarySkeleton } from './portfolio-summary-skeleton'
import { MarketOverviewSkeleton } from './market-overview-skeleton'
import { PortfolioChartSkeleton } from './portfolio-chart-skeleton'
import { Typography } from '@/frontend/components/ui/typography'

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
                <MarketOverviewSkeleton />
              </div>
            </div>
          </div>
        </div>
      </Stack>

      {/* Brand Breakdown Skeleton */}
      <Stack gap="md">
        <Stack gap="none">
          <Typography as="h2" variant="h3">Holdings</Typography>
          <Typography variant="body-sm">By brand</Typography>
        </Stack>
        <div className="flex gap-4 overflow-hidden pb-2 scroll-smooth-x hide-scrollbar">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="shrink-0 w-[280px] h-[180px] bg-(--surface-elevated) border border-(--border) rounded-xl p-4 flex flex-col gap-4 opacity-50"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-auto space-y-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          ))}
          {/* Spacer to match final horizontal scroll padding */}
          <div className="w-2 shrink-0" />
        </div>
      </Stack>

      {/* Chart Skeleton */}
      <PortfolioChartSkeleton />

      {/* Bottom Spacer */}
      <Section className="h-24 md:h-12" />
    </Stack>
  )
}
