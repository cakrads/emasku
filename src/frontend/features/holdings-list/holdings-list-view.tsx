'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
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

  // Fetch holdings (filtered by status)
  const { data: filteredData, isLoading: isLoadingFiltered, error } = useQuery({
    queryKey: ['portfolio', 'list', statusFilter],
    queryFn: () => fetchPortfolioList({ status: statusFilter }),
  })

  // Fetch all holdings to check for total data presence
  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['portfolio', 'list', 'all'],
    queryFn: () => fetchPortfolioList({ status: 'all' }),
  })

  // Fetch all brands for the filter
  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  // Handle loading and error
  if (isLoadingFiltered || isLoadingAll) return (
    <HoldingsListSkeleton />
  )

  if (error || !filteredData || !allData) {
    throw error || new Error('Failed to load holdings')
  }

  const allHoldings = filteredData.items
  const totalHoldingsCount = allData.items.length

  // Filter holdings by brand
  let brandFilteredHoldings = brandFilter
    ? allHoldings.filter((h) => h.brand === brandFilter)
    : allHoldings

  // Sort holdings
  brandFilteredHoldings = [...brandFilteredHoldings].sort((a, b) => {
    let output = 0
    if (sortBy === 'date') {
      output = new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime()
    } else {
      output = (a.currentValue || 0) - (b.currentValue || 0)
    }
    return sortOrder === 'asc' ? output : -output
  })

  // Transform to View Models
  const viewModels = brandFilteredHoldings.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US'))

  // Global empty state: User has absolutely no data
  if (totalHoldingsCount === 0) {
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

      {/* Holdings Table or Filtered Empty Message */}
      <Section>
        {viewModels.length > 0 ? (
          <HoldingsTable holdings={viewModels} />
        ) : (
          <div className="py-20 text-center border border-dashed border-border rounded-xl bg-surface/50">
            <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
              {t('holdings.noItemsFound')}
            </Typography>
          </div>
        )}
      </Section>

      {/* Bottom spacing */}
      <Section className="h-12" />
    </Stack>
  )
}
