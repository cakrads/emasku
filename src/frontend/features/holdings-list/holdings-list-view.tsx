'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchPortfolioList, fetchPortfolioSummary } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem, transformPortfolioSummary } from '@/frontend/view-model/portfolio.vm'
import HoldingsTable from '../holdings-brand-category/components/holdings-table'
import { HoldingsListSkeleton } from './components/holdings-list-skeleton'
import HoldingsListEmpty from './components/holdings-list-empty'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { Button } from '@/frontend/components/ui/button'
import { Plus, Filter, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { useLanguage } from '@/frontend/hooks/use-language'

// New components
import PortfolioSummarySection from './components/portfolio-summary-section'
import FilterModal from './components/filter-modal'
import BrandSummaryModal from './components/brand-summary-modal'


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

  // Filter state
  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'active' | 'sold' | 'all'>('active')

  // Modal state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isBrandSummaryOpen, setIsBrandSummaryOpen] = useState(false)

  // Build filter object for API calls
  const apiFilter = {
    status: statusFilter,
    brandCodes: brandFilter ? [brandFilter] : undefined,
  }

  // Fetch holdings (filtered)
  const { data: filteredData, isLoading: isLoadingFiltered, error } = useQuery({
    queryKey: ['portfolio', 'list', statusFilter, brandFilter, sortBy, sortOrder],
    queryFn: () => fetchPortfolioList(apiFilter),
  })

  // Fetch all holdings to check for total data presence (no filters)
  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['portfolio', 'list', 'all-count'],
    queryFn: () => fetchPortfolioList({ status: 'all' }),
  })

  // Fetch Portfolio Summary with same filters for consistency
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['portfolio', 'summary', statusFilter, brandFilter],
    queryFn: () => fetchPortfolioSummary(apiFilter),
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
  const totalHoldingsCount = allData.pagination.totalItems

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
  const summaryViewModel = summaryData ? transformPortfolioSummary(summaryData, t, language === 'id' ? 'id-ID' : 'en-US') : null

  // Calculate if any filter is active (beyond defaults)
  const isFiltered = brandFilter !== null || statusFilter !== 'active' || sortBy !== 'date' || sortOrder !== 'desc'

  // Handle filter apply
  const handleFilterApply = (filters: {
    brand: string | null
    status: 'active' | 'sold' | 'all'
    sortBy: 'date' | 'value'
    sortOrder: 'asc' | 'desc'
  }) => {
    setBrandFilter(filters.brand)
    setStatusFilter(filters.status)
    setSortBy(filters.sortBy)
    setSortOrder(filters.sortOrder)
  }

  // Global empty state: User has absolutely no data
  if (totalHoldingsCount === 0) {
    return <HoldingsListEmpty />
  }

  // Get active filter count for badge
  const activeFilterCount = [
    statusFilter !== 'active',
    brandFilter !== null,
    sortBy !== 'date',
    sortOrder !== 'desc',
  ].filter(Boolean).length

  return (
    <Stack gap="sm">
      {/* Action Bar - Filter button + Brand Summary (FIRST, before summary) */}
      <div className="flex flex-wrap items-center gap-2">
        <Stack direction="horizontal" gap="sm">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>{t('holdings.filters.title')}</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Brand Summary Button */}
          {summaryViewModel?.brandAllocation && summaryViewModel.brandAllocation.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBrandSummaryOpen(true)}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t('holdings.brandSummary.title')}</span>
            </Button>
          )}
        </Stack>
      </div>

      {/* Portfolio Summary Section (AFTER filter) */}
      <PortfolioSummarySection
        totalWeightGram={summaryData?.totalWeightGram || 0}
        totalBuyValue={summaryData?.totalBuyValue || 0}
        totalCurrentValue={summaryData?.totalCurrentValue || 0}
        totalPnL={summaryData?.totalPnL || 0}
        pnlPercentage={summaryData?.pnlPercentage || 0}
        isFiltered={isFiltered}
        isLoading={isLoadingSummary}
        statusFilter={statusFilter}
      />

      {/* Holdings Table or Filtered Empty Message */}
      <Section>
        {viewModels.length > 0 ? (
          <HoldingsTable holdings={viewModels} />
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
            <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
              {t('holdings.noItemsFound')}
            </Typography>
          </div>
        )}
      </Section>

      {/* Bottom spacing */}
      <div className="h-8" />

      {/* Filter Modal */}
      <FilterModal
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        brands={brandsData?.items || []}
        brandFilter={brandFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApply={handleFilterApply}
      />

      {/* Brand Summary Modal - no click functionality */}
      <BrandSummaryModal
        open={isBrandSummaryOpen}
        onOpenChange={setIsBrandSummaryOpen}
        brands={summaryViewModel?.brandAllocation || []}
      />
    </Stack>
  )
}
