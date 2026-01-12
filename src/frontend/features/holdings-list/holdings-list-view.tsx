'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem } from '@/frontend/view-model/portfolio.vm'
import FilterBar from './components/filter-bar'
import HoldingsTable from '../holdings-brand-category/components/holdings-table'
import { HoldingsListSkeleton } from './components/holdings-list-skeleton'
import HoldingsListEmpty from './components/holdings-list-empty'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { Button } from '@/frontend/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { useLanguage } from '@/frontend/hooks/use-language'


export default function HoldingsListView() {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('holdings.title')}
      description={t('holdings.description')}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: 'Holdings' }
      ]}
      action={
        <Link href={ROUTES.ADD_HOLDING}>
          <Button color="primary" className="hidden md:flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>{t('holdings.addHolding')}</span>
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
  const { language, t } = useLanguage()
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
      output = (a.currentValue || 0) - (b.currentValue || 0)
    }
    return sortOrder === 'asc' ? output : -output
  })

  // Transform to View Models
  const viewModels = filteredHoldings.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US'))


  // Empty state when no holdings at all
  const hasNoHoldings = allHoldings.length === 0

  if (hasNoHoldings) {
    return <HoldingsListEmpty />
  }

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
