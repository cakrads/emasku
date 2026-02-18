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
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { Button } from '@/frontend/components/ui/button'
import { Plus, Filter, LayoutGrid, Calculator } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { useUrlFilters } from '@/frontend/hooks/use-url-filters'
import { PrivacyToggle } from '@/frontend/components/ui/privacy-toggle'

// New components
import PortfolioSummarySection from './components/portfolio-summary-section'
import FilterModal from './components/filter-modal'
import BrandSummaryModal from './components/brand-summary-modal'
import ToolsModal from './components/tools-modal'
import { Wrench } from 'lucide-react'

export default function HoldingsListView() {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('holdings.title')}
      description={t('holdings.description')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('navbar.holdings') }
      ]}
      action={
        <Link href={ROUTES.ADD_HOLDING}>
          <Button variant="solid" color="primary" className="hidden md:flex items-center gap-2">
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

  // URL-synced filter state
  const {
    filters,
    setPagination,
    updateUrl
  } = useUrlFilters({
    pageIndex: 0,
    pageSize: 10
  })

  // Destructure for easy access
  const {
    brand: brandFilter,
    status: statusFilter,
    goalId,
    sortBy,
    sortOrder,
    pageIndex,
    pageSize
  } = filters

  // Modal state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isBrandSummaryOpen, setIsBrandSummaryOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  // Build filter object for API calls
  const apiFilter = {
    status: statusFilter,
    brandCodes: brandFilter ? [brandFilter] : undefined,
    goalId: goalId || undefined,
  }

  // Fetch holdings (filtered)
  const { data: filteredData, isLoading: isLoadingFiltered, error } = useQuery({
    queryKey: ['portfolio', 'list', statusFilter, brandFilter, goalId, sortBy, sortOrder, pageIndex, pageSize],
    queryFn: () => fetchPortfolioList(apiFilter, {
      page: pageIndex + 1, // API is 1-indexed
      pageSize: pageSize
    }),
  })

  // Fetch all holdings to check for total data presence (no filters) for empty state check
  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['portfolio', 'list', 'all-count'],
    queryFn: () => fetchPortfolioList({ status: 'all' }),
  })

  // Fetch Portfolio Summary with same filters for consistency
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['portfolio', 'summary', statusFilter, brandFilter, goalId],
    queryFn: () => fetchPortfolioSummary(apiFilter),
  })

  // Fetch all brands for the filter
  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  // Fetch all goals for the filter
  const { data: goalsData } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
  })

  // Handle loading and error
  if (isLoadingFiltered || isLoadingAll) return (
    <HoldingsListSkeleton />
  )

  if (error || !filteredData || !allData) {
    throw error || new Error('Failed to load holdings')
  }

  const allHoldings = filteredData.items
  const totalHoldingsCount = allData.pagination.totalItems // Total items in DB (for empty state check)

  // Pagination info from current query
  const totalFilteredItems = filteredData.pagination.totalItems
  const pageCount = filteredData.pagination.totalPages

  // Sort holdings (Client-side sorting of current page)
  // Note: Since API doesn't support sorting yet, we sort the *current page* results.
  let sortedHoldings = [...allHoldings].sort((a, b) => {
    let output = 0
    if (sortBy === 'date') {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      output = timeA - timeB
    } else {
      output = (a.currentValue || 0) - (b.currentValue || 0)
    }
    return sortOrder === 'asc' ? output : -output
  })

  // Transform to View Models
  const viewModels = sortedHoldings.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US'))
  const summaryViewModel = summaryData ? transformPortfolioSummary(summaryData, t, language === 'id' ? 'id-ID' : 'en-US') : null

  // Calculate if any filter is active (beyond defaults)
  const isFiltered = brandFilter !== null || statusFilter !== 'active' || goalId !== null || sortBy !== 'date' || sortOrder !== 'desc'

  // Handle filter apply
  const handleFilterApply = (newFilters: {
    brand: string | null
    status: 'active' | 'sold' | 'all'
    goalId: string | null
    sortBy: 'date' | 'value'
    sortOrder: 'asc' | 'desc'
  }) => {
    updateUrl({
      ...newFilters,
      pageIndex: 0 // Reset to first page on filter change
    })
  }

  // Global empty state: User has absolutely no data (and no filters active to cause it)
  if (totalHoldingsCount === 0 && !isFiltered) {
    return <HoldingsListEmpty />
  }

  // Get active filter count for badge
  const activeFilterCount = [
    statusFilter !== 'active',
    brandFilter !== null,
    goalId !== null,
    sortBy !== 'date',
    sortOrder !== 'desc',
  ].filter(Boolean).length

  return (
    <Stack gap="sm">
      {/* Action Bar - Filter button + Brand Summary */}
      {/* Action Bar - Mobile: 3 Modal Triggers | Desktop: Original layout */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Desktop View */}
        <div className="hidden md:flex flex-wrap items-center gap-2 flex-1">
          <PrivacyToggle className="border border-border/50" />

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

          <Link href={ROUTES.BUYBACK_SIMULATION}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>{t('buybackSimulation.cta')}</span>
            </Button>
          </Link>

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

          <div className="h-6 w-px bg-border/50 mx-1" />

          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => handleFilterApply({
                brand: filters.brand,
                status: 'active',
                goalId: filters.goalId,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
              })}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'active'
                ? 'bg-background shadow-sm text-foreground ring-1 ring-border/50'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t('holdings.filters.options.active')}
            </button>
            <button
              onClick={() => handleFilterApply({
                brand: filters.brand,
                status: 'sold',
                goalId: filters.goalId,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
              })}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === 'sold'
                ? 'bg-background shadow-sm text-foreground ring-1 ring-border/50'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t('holdings.filters.options.sold')}
            </button>
          </div>
        </div>

        {/* Mobile View - 2 Consolidate Modals + Privacy Icon */}
        <div className="flex md:hidden items-center gap-2 w-full">
          {/* Privacy Icon Toggle */}
          <PrivacyToggle className="h-10 w-10 border border-border/50 bg-background" iconClassName="h-5 w-5" />

          {/* 1. Filter */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 gap-2 h-10 border-border/50"
          >
            <div className="relative">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {activeFilterCount > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent-gold text-white text-[10px] flex items-center justify-center rounded-full border-2 border-background">
                  {activeFilterCount}
                </div>
              )}
            </div>
            <span className="text-xs">{t('holdings.filters.title')}</span>
          </Button>

          {/* 2. Tools */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsToolsOpen(true)}
            className="flex-1 gap-2 h-10 border-border/50"
          >
            <Wrench className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs">{t('holdings.tools.title')}</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Section */}
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
          <HoldingsTable
            holdings={viewModels}
            pageCount={pageCount}
            totalItems={totalFilteredItems}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={(p) => setPagination(p.pageIndex, p.pageSize)}
            isLoading={isLoadingFiltered}
          />
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
        goals={goalsData?.goals || []}
        brandFilter={brandFilter}
        statusFilter={statusFilter}
        goalIdFilter={goalId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApply={handleFilterApply}
      />

      <ToolsModal
        open={isToolsOpen}
        onOpenChange={setIsToolsOpen}
        onShowBrandSummary={() => setIsBrandSummaryOpen(true)}
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
