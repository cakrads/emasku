'use client'

import { useState, useEffect } from 'react'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { sortHoldings } from '@/frontend/utils/aggregations'
import FilterBar from './components/filter-bar'
import HoldingsTable from '../brand-category/components/holdings-table'
import { ROUTES } from '@/frontend/config/routes'

export default function HoldingsListView() {
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [allHoldings, setAllHoldings] = useState(DUMMY_HOLDINGS)

  useEffect(() => {
    setAllHoldings(holdingsRepository.getAll())
  }, [])

  // Filter holdings by brand if filter is set
  let filteredHoldings = brandFilter
    ? allHoldings.filter((h) => h.brandCode === brandFilter)
    : allHoldings

  // Sort holdings
  filteredHoldings = sortHoldings(filteredHoldings, sortBy, sortOrder)

  // Get unique brands for filter dropdown
  const uniqueBrands = Array.from(
    new Set(allHoldings.map((h) => h.brandCode))
  ).map((code) => ({
    code,
    name: allHoldings.find((h) => h.brandCode === code)?.brandName || code,
  }))

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

          {/* Header */}
          <Stack gap="none">
            <Typography variant="h1">All Holdings</Typography>
            <Typography variant="body" className="text-(--foreground-muted)">
              {filteredHoldings.length} {filteredHoldings.length === 1 ? 'holding' : 'holdings'}
              {brandFilter && ` in ${uniqueBrands.find((b) => b.code === brandFilter)?.name}`}
            </Typography>
          </Stack>

          {/* Filter Bar */}
          <FilterBar
            brands={uniqueBrands}
            selectedBrand={brandFilter}
            onBrandChange={setBrandFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {/* Holdings Table */}
          <Section>
            <HoldingsTable holdings={filteredHoldings} />
          </Section>

          {/* Bottom spacing */}
          <Section className="h-12" />
        </Stack>
      </Container>
    </PageWrapper>
  )
}
