'use client'

import { useState, useEffect } from 'react'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { DUMMY_HOLDINGS } from '@/frontend/data/dummy-holdings'
import { holdingsRepository } from '@/frontend/utils/holdings-repository'
import { sortHoldings } from '@/frontend/utils/aggregations'
import FilterBar from './components/filter-bar'
import HoldingsTable from '../brand-category/components/holdings-table'

import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'

import { Button } from '@/frontend/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
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

  const description = `${filteredHoldings.length} ${filteredHoldings.length === 1 ? 'holding' : 'holdings'}${brandFilter ? ` in ${uniqueBrands.find((b) => b.code === brandFilter)?.name}` : ''}`

  return (
    <StandardPageLayout
      title="All Holdings"
      description={description}
      breadcrumbs={[{ label: 'Home', href: ROUTES.DASHBOARD }, { label: 'Holdings' }]}
      action={
        <Button asChild className="bg-accent-gold hover:bg-accent-gold/90 text-white border-none shadow-md">
          <Link href={ROUTES.ADD_HOLDING}>
            <Plus className="w-4 h-4 mr-2" />
            Add Holding
          </Link>
        </Button>
      }
    >
      <Stack gap="lg">
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
    </StandardPageLayout>
  )
}
