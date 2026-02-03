'use client'

import { useQuery } from '@tanstack/react-query'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import PortfolioHero from './components/portfolio-hero'
import PriceFreshness from './components/price-freshness'
import BrandBreakdown from './components/brand-breakdown'
import HoldingsPreview from './components/holdings-preview'
import AddHoldingButton from './components/add-holding-button'
import PortfolioHeroEmpty from './components/portfolio-hero-empty'
import BrandBreakdownEmpty from './components/brand-breakdown-empty'
import { PricesTodayCards } from './components/prices-today-cards'
import { fetchPortfolioSummary } from '@/frontend/services/portfolio/portfolio.api'
import { transformPortfolioSummary } from '@/frontend/view-model/portfolio.vm'
import { PortfolioSummarySkeleton } from './components/portfolio-summary-skeleton'
import { BrandBreakdownSkeleton } from './components/brand-breakdown-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'

function DashboardContent() {
  const { t, language } = useLanguage()
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: () => fetchPortfolioSummary(),
  })

  const viewModel = data ? transformPortfolioSummary(data, t, language === 'id' ? 'id-ID' : 'en-US') : null
  const lastUpdated = viewModel?.lastUpdated

  // Empty state detection
  const hasHoldings = viewModel && viewModel.brandAllocation.length > 0

  return (
    <div className="animate-fade-in">
      <Stack gap="xl">
        {/* Top Section: Date + Hero + Market Today */}
        <Stack gap="md">
          {/* Portfolio Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-foreground">{t('dashboard.portfolio')}</h1>
            <div className="flex items-center gap-2">
              <PriceFreshness lastUpdated={lastUpdated} isLoading={isLoading} />
            </div>
          </div>

          {/* Portfolio Summary - Full Width Row */}
          <ErrorBoundary>
            {isLoading ? (
              <PortfolioSummarySkeleton />
            ) : hasHoldings && viewModel ? (
              <PortfolioHero
                totalValue={viewModel.totalCurrentValue}
                totalPnL={viewModel.totalPnL}
                gainLossPercentage={viewModel.pnlPercentage}
                todayChange={viewModel.todayPnL}
                todayChangePercentage={viewModel.todayPnLPercentage}
                weeklyChange={viewModel.weeklyPnL}
                weeklyChangePercentage={viewModel.weeklyPnLPercentage}
                monthlyChange={viewModel.monthlyPnL}
                monthlyChangePercentage={viewModel.monthlyPnLPercentage}
                yearlyChange={viewModel.yearlyPnL}
                yearlyChangePercentage={viewModel.yearlyPnLPercentage}
                pnlColor={viewModel.pnlColor}
                todayColor={viewModel.todayPnLColor}
                weeklyColor={viewModel.weeklyPnLColor}
                monthlyColor={viewModel.monthlyPnLColor}
                yearlyColor={viewModel.yearlyPnLColor}
                disclaimer={viewModel.disclaimer}
                excludedCount={viewModel.excludedCount}
              />
            ) : (
              <PortfolioHeroEmpty />
            )}
          </ErrorBoundary>

        </Stack>

        {/* Market Today - Full Width Row */}
        <ErrorBoundary>
          <PricesTodayCards />
        </ErrorBoundary>

        {/* Brand Breakdown - Granular Loading */}
        <ErrorBoundary>
          {isLoading ? (
            <BrandBreakdownSkeleton />
          ) : hasHoldings && viewModel ? (
            <BrandBreakdown brands={viewModel.brandAllocation} />
          ) : (
            <BrandBreakdownEmpty />
          )}
        </ErrorBoundary>

        {/* Holdings Preview - Recent 5 holdings */}
        <ErrorBoundary>
          <HoldingsPreview />
        </ErrorBoundary>

        {/* Primary action FAB */}
        <AddHoldingButton onClick={() => console.log('Add button clicked')} />

        {/* Bottom spacing for mobile */}
        <Section className="md:h-12" />
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
