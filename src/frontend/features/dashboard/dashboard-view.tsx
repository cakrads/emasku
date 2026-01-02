'use client'

import { useState, useEffect } from 'react'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import PortfolioHero from './components/portfolio-hero'
import PriceFreshness from './components/price-freshness'
import BrandBreakdown from './components/brand-breakdown'
import PortfolioChart from './components/portfolio-chart'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { aggregateHoldingsByBrand } from '@/frontend/utils/aggregations'
import AddHoldingButton from './components/add-holding-button'

// Dummy data matching the reference images
type ValuationSource = 'OFFICIAL' | 'SPOT' | 'USER' | 'UNVALUED'

interface BrandData {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: ValuationSource
}

// Dummy data matching the reference images
const DUMMY_DATA: { lastUpdated: Date; brands: BrandData[]; chartData: any[] } = {
  lastUpdated: new Date(2025, 11, 31, 8, 0), // 08:00
  brands: [
    {
      brandCode: 'ANTAM',
      brandName: 'ANTAM',
      totalGrams: 50.0,
      currentValue: 63500000,
      deltaValue: 285000,
      deltaPercentage: 0.45,
      valuationSource: 'OFFICIAL',
    },
    {
      brandCode: 'GALERI24',
      brandName: 'Galeri24',
      totalGrams: 35.0,
      currentValue: 44200000,
      deltaValue: 123600,
      deltaPercentage: 0.28,
      valuationSource: 'OFFICIAL',
    },
    {
      brandCode: 'UBS',
      brandName: 'UBS',
      totalGrams: 15.0,
      currentValue: 19150000,
      deltaValue: -21000,
      deltaPercentage: -0.12,
      valuationSource: 'SPOT',
    },
    {
      brandCode: 'LOTUS_ARCHI',
      brandName: 'Lotus Archi',
      totalGrams: 1.0,
      currentValue: 1000000,
      deltaValue: 0,
      deltaPercentage: 0.0,
      valuationSource: 'USER',
    },
    {
      brandCode: 'UNKNOWN',
      brandName: 'Unknown Brand',
      totalGrams: 5.0,
      currentValue: 0,
      deltaValue: 0,
      deltaPercentage: 0.0,
      valuationSource: 'UNVALUED',
    },
  ],
  chartData: [
    { date: '2025-12-24', value: 125000000 },
    { date: '2025-12-25', value: 125500000 },
    { date: '2025-12-26', value: 125200000 },
    { date: '2025-12-27', value: 126800000 },
    { date: '2025-12-28', value: 127100000 },
    { date: '2025-12-29', value: 127500000 },
    { date: '2025-12-30', value: 127429000 },
    { date: '2025-12-31', value: 127850000 },
  ],
}

function calculatePortfolioStats(brands: BrandData[]) {
  const validSources: ValuationSource[] = ['OFFICIAL', 'SPOT', 'USER']
  const includedBrands = brands.filter(b => validSources.includes(b.valuationSource))
  const excludedBrands = brands.filter(b => b.valuationSource === 'UNVALUED')

  const totalValue = includedBrands.reduce((sum, b) => sum + b.currentValue, 0)
  const totalDelta = includedBrands.reduce((sum, b) => sum + b.deltaValue, 0)

  let deltaPercentage = 0
  if (totalValue > 0) {
    const previousValue = totalValue - totalDelta
    if (previousValue !== 0) {
      deltaPercentage = (totalDelta / previousValue) * 100
    }
  }

  const hasMixedValuation = includedBrands.some(b => ['SPOT', 'USER'].includes(b.valuationSource))

  return {
    totalValue: includedBrands.length > 0 ? totalValue : null,
    totalGainLoss: totalValue * 0.1118,
    gainLossPercentage: 11.18,
    todayChange: totalDelta,
    todayChangePercentage: deltaPercentage,
    excludedCount: excludedBrands.length,
    disclaimer: hasMixedValuation ? 'Includes SPOT-based and user-estimated values' : undefined
  }
}

function deriveValuationSource(brandCode: string): ValuationSource {
  switch (brandCode) {
    case 'ANTAM':
    case 'GALERI24':
      return 'OFFICIAL'
    case 'UBS':
      return 'SPOT'
    case 'UNKNOWN':
      return 'UNVALUED'
    default:
      return 'USER'
  }
}

export default function DashboardView() {
  const [brands, setBrands] = useState<BrandData[]>(DUMMY_DATA.brands)

  useEffect(() => {
    // Load holdings from repository (includes local overrides)
    const allHoldings = holdingsRepository.getAll()

    // Aggregate by brand
    const summaries = aggregateHoldingsByBrand(allHoldings)

    // Map to BrandData
    const brandData: BrandData[] = summaries.map(s => ({
      brandCode: s.brandCode,
      brandName: s.brandName,
      totalGrams: s.totalWeight,
      currentValue: s.totalCurrentValue,
      deltaValue: s.unrealizedPL,
      deltaPercentage: s.unrealizedPLPercentage,
      valuationSource: deriveValuationSource(s.brandCode)
    }))

    // Sort to keep consistent order if needed, or rely on aggregation order
    // (DUMMY_DATA had specific order, but acceptable to change)
    setBrands(brandData)
  }, [])

  const stats = calculatePortfolioStats(brands)

  return (
    <PageWrapper>
      <Container className="max-w-7xl md:p-8 relative p-0">
        <Stack gap="none">
          {/* Hero section */}
          <PortfolioHero
            totalValue={stats.totalValue}
            totalGainLoss={stats.totalGainLoss}
            gainLossPercentage={stats.gainLossPercentage}
            todayChange={stats.todayChange}
            todayChangePercentage={stats.todayChangePercentage}
            excludedCount={stats.excludedCount}
            disclaimer={stats.disclaimer}
          />

          {/* Price freshness indicator */}
          <PriceFreshness lastUpdated={DUMMY_DATA.lastUpdated} />

          {/* Brand breakdown */}
          <BrandBreakdown brands={brands} />

          {/* Portfolio performance snapshot */}
          <PortfolioChart data={DUMMY_DATA.chartData} />


          {/* Primary action FAB */}
          <AddHoldingButton onClick={() => console.log('Add button clicked')} />

          {/* Bottom spacing for mobile */}
          <Section className="h-24 md:h-12" />

        </Stack>
      </Container>
    </PageWrapper>
  )
}
