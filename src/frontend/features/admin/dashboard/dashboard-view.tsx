'use client'

import { useQuery } from '@tanstack/react-query'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { PrivacyToggle } from '@/frontend/components/ui/privacy-toggle'
import PortfolioHero from './components/portfolio-hero'
import PriceFreshness from './components/price-freshness'
import BrandBreakdown from './components/brand-breakdown'
import HoldingsPreview from './components/holdings-preview'
import PortfolioHeroEmpty from './components/portfolio-hero-empty'
import BrandBreakdownEmpty from './components/brand-breakdown-empty'
import { PricesTodayCards } from './components/prices-today-cards'
import { QuickActions } from './components/quick-actions'
import { fetchPortfolioSummary } from '@/frontend/services/portfolio/portfolio.api'
import { transformPortfolioSummary } from '@/frontend/view-model/portfolio.vm'
import { PortfolioSummarySkeleton } from './components/portfolio-summary-skeleton'
import { BrandBreakdownSkeleton } from './components/brand-breakdown-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'
import GoalsSection from './components/goals-section'

function DashboardContent() {
  const { t, language } = useLanguage()
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: () => fetchPortfolioSummary(),
  })

  const viewModel = data ? transformPortfolioSummary(data, t, language === 'id' ? 'id-ID' : 'en-US') : null
  const lastUpdated = viewModel?.lastUpdated
  const hasHoldings = viewModel && viewModel.brandAllocation.length > 0

  return (
    <Stack gap="xl" className="animate-fade-in">

      {/* 1. Greeting + Privacy Toggle row */}
      <Stack gap="sm">
        <Stack direction="horizontal" gap="sm" className="items-center justify-between">
          <Typography as="h1" variant="body" className="text-xl font-semibold text-foreground">
            {t('dashboard.portfolio')}
          </Typography>
          <Stack direction="horizontal" gap="sm" className="items-center">
            <PrivacyToggle className="text-muted-foreground/70" iconClassName="h-4 w-4" />
            <PriceFreshness lastUpdated={lastUpdated} isLoading={isLoading} />
          </Stack>
        </Stack>

        {/* 2. Hero Value */}
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

      {/* 3. Quick Actions */}
      <QuickActions />

      {/* 4. Market Today */}
      <ErrorBoundary>
        <PricesTodayCards />
      </ErrorBoundary>

      {/* 5. Brand Breakdown - 2-col grid */}
      <ErrorBoundary>
        {isLoading ? (
          <BrandBreakdownSkeleton />
        ) : hasHoldings && viewModel ? (
          <BrandBreakdown brands={viewModel.brandAllocation} />
        ) : (
          <BrandBreakdownEmpty />
        )}
      </ErrorBoundary>

      {/* 6. Recent Holdings */}
      <ErrorBoundary>
        <HoldingsPreview />
      </ErrorBoundary>

      {/* 7. Goals */}
      <ErrorBoundary>
        <GoalsSection />
      </ErrorBoundary>

      {/* Bottom spacing for mobile nav */}
      <Section className="h-12" />
    </Stack>
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
