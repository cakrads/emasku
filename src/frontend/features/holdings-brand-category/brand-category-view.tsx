'use client'

import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem } from '@/frontend/view-model/portfolio.vm'
import BrandSummary from './components/brand-summary'
import HoldingsTable from './components/holdings-table'
import { ROUTES } from '@/frontend/config/routes'
import { HoldingsListSkeleton } from '@/frontend/features/holdings-list/components/holdings-list-skeleton'
import { useLanguage } from '@/frontend/hooks/use-language'

interface BrandCategoryViewProps {
  brandId: string
}


import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'

export default function BrandCategoryView(props: BrandCategoryViewProps) {
  return (
    <StandardPageLayout
      title="Brand Holdings"
      description="Allocated gold holdings for this brand"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: 'Brand' }
      ]}
    >
      <ErrorBoundary>
        <BrandCategoryContent {...props} />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}

function BrandCategoryContent({ brandId }: BrandCategoryViewProps) {
  const { language } = useLanguage()
  // Fetch all holdings
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'list'],
    queryFn: () => fetchPortfolioList(),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <HoldingsListSkeleton />
      </div>
    )
  }

  if (error || !data) {
    throw error || new Error('Failed to load holdings')
  }

  const allHoldings = data.items

  // Filter holdings by brand code
  const brandHoldings = allHoldings.filter((h) => h.brand === brandId)

  // If no holdings found for this brand
  if (brandHoldings.length === 0) {
    return (
      <Stack gap="lg">
        <Typography variant="body">
          No holdings found for brand code: {brandId}
        </Typography>
      </Stack>
    )
  }

  // Aggregate data
  const totalWeight = brandHoldings.reduce((sum, h) => sum + (h.denominationGram * h.quantity), 0)
  const totalBuyValue = brandHoldings.reduce((sum, h) => sum + h.totalBuyValue, 0)
  const totalCurrentValue = brandHoldings.reduce((sum, h) => sum + (h.currentValue || 0), 0)
  const unrealizedPL = totalCurrentValue - totalBuyValue
  const unrealizedPLPercentage = totalBuyValue > 0 ? (unrealizedPL / totalBuyValue) * 100 : 0
  const brandName = brandHoldings[0].brandName

  const summary = {
    brandCode: brandId,
    brandName: brandName,
    totalWeight,
    totalBuyValue,
    totalCurrentValue,
    unrealizedPL,
    unrealizedPLPercentage,
    holdingsCount: brandHoldings.length,
  }

  // Transform to view models for table
  const viewModels = brandHoldings.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US'))

  return (
    <Stack gap="lg">

      {/* Brand Summary Section - Aggregated from holdings */}
      <BrandSummary {...summary} />

      {/* Holdings List - Filtered by brand */}
      <Section>
        <Stack gap="md">
          <Typography variant="h3">Holdings</Typography>
          <HoldingsTable holdings={viewModels} backUrl={ROUTES.BRAND_DETAIL(brandId)} />
        </Stack>
      </Section>

      {/* Bottom spacing */}
      <Section className="h-12" />
    </Stack>
  )
}
