'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem } from '@/frontend/view-model/portfolio.vm'
import FilterBar from './components/filter-bar'
import HoldingsTable from '../brand-category/components/holdings-table'
import { HoldingsListSkeleton } from './components/holdings-list-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { Button } from '@/frontend/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchBrands } from '@/frontend/services/brands/brands.api'


export default function HoldingsListView() {
  return (
    <StandardPageLayout
      title="Portfolio Holdings"
      description="Detailed overview of your gold investments"
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings' }
      ]}
      action={
        <Link href={ROUTES.ADD_HOLDING}>
          <Button
            className="flex items-center gap-2 bg-accent-gold hover:bg-accent-gold/90 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Holding</span>
          </Button>
        </Link>
      }
    >
      <ErrorBoundary>
        <HoldingsListContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}

function HoldingsListContent() {
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'active' | 'sold' | 'all'>('active')

  // Fetch holdings
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'list', statusFilter],
    queryFn: () => fetchPortfolioList({ status: statusFilter }),
  })

  // Fetch all brands for the filter
  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  // Handle loading and error
  if (isLoading) return (
    <HoldingsListSkeleton />
  )

  if (error || !data) {
    throw error || new Error('Failed to load holdings')
  }

  const allHoldings = data.items

  // Filter holdings
  let filteredHoldings = brandFilter
    ? allHoldings.filter((h) => h.brand === brandFilter) // API returns brand code in 'brand'
    : allHoldings

  // Sort holdings
  filteredHoldings = [...filteredHoldings].sort((a, b) => {
    let output = 0
    if (sortBy === 'date') {
      output = new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
    } else {
      output = a.currentValue - b.currentValue
    }
    return sortOrder === 'asc' ? output : -output
  })

  // Transform to View Models
  const viewModels = filteredHoldings.map(transformHoldingItem)


  return (
    <Stack gap="lg">

      {/* Filter Bar */}
      <FilterBar
        brands={brandsData?.items || []}
        selectedBrand={brandFilter}
        onBrandChange={setBrandFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Holdings Table */}
      <Section>
        <HoldingsTable holdings={viewModels} />
      </Section>

      {/* Bottom spacing */}
      <Section className="h-12" />
    </Stack>
  )
}
