'use client'

import { useState, useEffect } from 'react'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { filterHoldingsByBrand, calculateHoldingValue } from '@/frontend/utils/aggregations'
import BrandSummary from './components/brand-summary'
import HoldingsTable from './components/holdings-table'
import { ROUTES } from '@/frontend/config/routes'

interface BrandCategoryViewProps {
  brandId: string
}

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'

export default function BrandCategoryView({ brandId }: BrandCategoryViewProps) {
  // Load holdings from repository
  const [allHoldings, setAllHoldings] = useState(DUMMY_HOLDINGS)

  useEffect(() => {
    setAllHoldings(holdingsRepository.getAll())
  }, [])

  // Filter holdings by brand (derived data, not stored)
  const brandHoldings = filterHoldingsByBrand(allHoldings, brandId)

  // If no holdings found for this brand
  if (brandHoldings.length === 0) {
    return (
      <StandardPageLayout
        title="Brand not found"
        breadcrumbs={[
          { label: 'Home', href: ROUTES.DASHBOARD },
          { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
          { label: brandId }
        ]}
      >
        <Stack gap="lg">
          <Typography variant="body">
            No holdings found for brand code: {brandId}
          </Typography>
        </Stack>
      </StandardPageLayout>
    )
  }

  // Aggregate data (computed on-demand, never stored)
  const totalWeight = brandHoldings.reduce((sum, h) => sum + h.weight, 0)
  const totalBuyValue = brandHoldings.reduce(
    (sum, h) => sum + h.buyPrice * h.weight,
    0
  )
  const totalCurrentValue = brandHoldings.reduce(
    (sum, h) => sum + h.currentPrice * h.weight,
    0
  )
  const unrealizedPL = totalCurrentValue - totalBuyValue
  const unrealizedPLPercentage =
    totalBuyValue > 0 ? (unrealizedPL / totalBuyValue) * 100 : 0

  const summary = {
    brandCode: brandId,
    brandName: brandHoldings[0].brandName,
    totalWeight,
    totalBuyValue,
    totalCurrentValue,
    unrealizedPL,
    unrealizedPLPercentage,
    holdingsCount: brandHoldings.length,
  }

  return (
    <StandardPageLayout
      title={summary.brandName}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings', href: ROUTES.HOLDINGS_LIST },
        { label: summary.brandName }
      ]}
    >
      <Stack gap="lg">
        {/* Brand Summary Section - Aggregated from holdings */}
        <BrandSummary {...summary} />

        {/* Holdings List - Filtered by brand */}
        <Section>
          <Stack gap="md">
            <Typography variant="h3">Holdings</Typography>
            <HoldingsTable holdings={brandHoldings} backUrl={ROUTES.BRAND_DETAIL(brandId)} />
          </Stack>
        </Section>

        {/* Bottom spacing */}
        <Section className="h-12" />
      </Stack>
    </StandardPageLayout>
  )
}
