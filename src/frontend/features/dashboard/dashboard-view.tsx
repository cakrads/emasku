'use client'

import { useQuery } from '@tanstack/react-query'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import PortfolioHero from './components/portfolio-hero'
import PriceFreshness from './components/price-freshness'
import BrandBreakdown from './components/brand-breakdown'
import PortfolioChart from './components/portfolio-chart'
import AddHoldingButton from './components/add-holding-button'
import { PricesTodayCards } from './components/prices-today-cards'
import { fetchPortfolioSummary, fetchPortfolioHistory } from '@/frontend/services/portfolio/portfolio.api'
import { transformPortfolioSummary, transformPortfolioHistory } from '@/frontend/view-model/portfolio.vm'
import { DashboardSkeleton } from './components/dashboard-skeleton'

import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'

// Re-using dummy chart data for now as it's not yet in the summary API
// DUMMY_CHART_DATA removed

function DashboardContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: fetchPortfolioSummary,
  })

  // We should also fetch holdings to populate BrandBreakdown
  // BUT for now let's focus on Summary API integration as requested.
  // BrandBreakdown expects BrandData[]. 
  // Let's hide BrandBreakdown for now or keep using dummy data?
  // User asked to "update frontend". Ideally should be fully integrated.
  // But doing everything in one step is risky.
  // Let's keep BrandBreakdown using dummy/local data for this step, 
  // and focus on replacing the Hero section with API data.

  // Actually, let's just comment out BrandBreakdown or use empty array for now
  // to show we are moving away from dummy data.
  // Or better, let's update it in next step.

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['portfolio', 'history'],
    queryFn: fetchPortfolioHistory,
  })

  const viewModel = data ? transformPortfolioSummary(data) : null
  const historyViewModel = historyData ? transformPortfolioHistory(historyData) : []
  const lastUpdated = new Date() // Should come from API or just use current time

  if (isLoading || isHistoryLoading) {
    return <DashboardSkeleton />
  }

  if (error || !viewModel) {
    throw error || new Error('Failed to load portfolio')
  }

  return (
    <div className="animate-fade-in">
      <Stack gap="xl">
        {/* Top Section: Date + Hero + Market Today */}
        <Stack gap="md">
          <div className="flex justify-end mb-4 lg:mb-0">
            <PriceFreshness lastUpdated={lastUpdated} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 min-h-auto md:min-h-[190px]">
              <PortfolioHero
                totalValue={viewModel.totalCurrentValue}
                gainLossPercentage={viewModel.pnlPercentage}
                todayChange={viewModel.totalPnL} // API returns total PnL, not today change distinctively yet
                todayChangePercentage={viewModel.pnlPercentage} // Same here, using total for now
                pnlColor={viewModel.pnlColor}
                disclaimer={viewModel.disclaimer}
                excludedCount={viewModel.excludedCount}
              />
            </div>

            <div className="lg:col-span-1 lg:relative min-w-0">
              <div className="flex flex-col h-full lg:absolute lg:inset-0 w-full">
                <div className="flex-1 overflow-hidden min-h-0">
                  <PricesTodayCards />
                </div>
              </div>
            </div>
          </div>
        </Stack>

        {/* Brand Breakdown - Real Data */}
        <BrandBreakdown brands={viewModel.brandAllocation} />

        {/* Portfolio performance snapshot */}
        <PortfolioChart data={historyViewModel} />

        {/* Primary action FAB */}
        <AddHoldingButton onClick={() => console.log('Add button clicked')} />

        {/* Bottom spacing for mobile */}
        <Section className="h-24 md:h-12" />
      </Stack>
    </div>
  )
}

export default function DashboardView() {
  return (
    <PageWrapper>
      <Container className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <ErrorBoundary>
          <DashboardContent />
        </ErrorBoundary>
      </Container>
    </PageWrapper>
  )
}
