'use client'

import { useState, useEffect } from 'react'

import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { filterHoldingsByBrand, calculateHoldingValue } from '@/frontend/utils/aggregations'
import BrandSummary from './components/brand-summary'
import HoldingsTable from './components/holdings-table'
import { ROUTES } from '@/frontend/config/routes'

interface BrandCategoryViewProps {
  brandId: string
}

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
      <PageWrapper>
        <Container className="max-w-7xl md:p-8 p-4">
          <Stack gap="lg">
            <Link
              href={ROUTES.DASHBOARD}
              className="flex items-center gap-2 text-(--foreground-muted) hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <Typography variant="body-sm">Back to Dashboard</Typography>
            </Link>
            <Typography variant="h2">Brand not found</Typography>
            <Typography variant="body">
              No holdings found for brand code: {brandId}
            </Typography>
          </Stack>
        </Container>
      </PageWrapper>
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
    <PageWrapper>
      <Container className="max-w-7xl md:p-8 p-4">
        <Stack gap="lg">
          {/* Back button */}
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 text-(--foreground-muted) hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <Typography variant="body-sm">Back to Dashboard</Typography>
          </Link>

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
      </Container>
    </PageWrapper>
  )
}
