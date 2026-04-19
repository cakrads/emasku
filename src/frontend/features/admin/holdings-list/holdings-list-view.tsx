'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button, buttonVariants } from '@/frontend/components/ui/button'
import { ActionChip } from '@/frontend/components/ui/action-chip'
import { ListRow } from '@/frontend/components/ui/list-row'
import { fetchPortfolioList, fetchPortfolioSummary } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem, transformPortfolioSummary } from '@/frontend/view-model/portfolio.vm'
import HoldingsTable from '../holdings-brand-category/components/holdings-table'
import { HoldingsListSkeleton } from './components/holdings-list-skeleton'
import HoldingsListEmpty from './components/holdings-list-empty'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { Plus, Calculator, LayoutGrid, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/frontend/config/routes'
import { fetchBrands } from '@/frontend/services/brands/brands.api'
import { fetchGoals } from '@/frontend/services/goals/goals.api'
import { useLanguage } from '@/frontend/hooks/use-language'
import { useUrlFilters } from '@/frontend/hooks/use-url-filters'
import { useSortedHoldings } from '@/frontend/hooks/use-sorted-holdings'
import { PrivacyToggle } from '@/frontend/components/ui/privacy-toggle'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'
import { cn } from '@/frontend/utils/cn'
import dynamic from 'next/dynamic'
import PortfolioSummarySection from './components/portfolio-summary-section-cards'

const BrandSummaryModal = dynamic(() => import('./components/brand-summary-modal'), { ssr: false })
const FilterModal = dynamic(() => import('./components/filter-modal'), { ssr: false })

function BrandCircle({ name }: { name: string }) {
  const raw = name.split(' ').filter(Boolean).map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()
  const initials = raw || name.slice(0, 2).toUpperCase() || '?'
  return (
    <div className="w-10 h-10 rounded-full bg-accent-gold/15 flex items-center justify-center shrink-0">
      <Typography variant="caption" className="font-bold text-accent-gold text-sm">{initials}</Typography>
    </div>
  )
}

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
        <Link
          href={ROUTES.ADD_HOLDING}
          className={cn(buttonVariants({ variant: 'solid', color: 'primary', size: 'sm' }), 'hidden md:flex items-center gap-2')}
        >
          <Plus className="h-4 w-4" />
          <span>{t('holdings.addHolding')}</span>
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
  const router = useRouter()
  const { isVisible } = usePortfolioPrivacy()

  const { filters, setPagination, updateUrl } = useUrlFilters({
    pageIndex: 0,
    pageSize: 10
  })

  const { brand: brandFilter, status: statusFilter, goalId, sortBy, sortOrder, pageIndex, pageSize } = filters

  const [isBrandSummaryOpen, setIsBrandSummaryOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const apiFilter = {
    status: statusFilter,
    brandCodes: brandFilter ? [brandFilter] : undefined,
    goalId: goalId || undefined,
  }

  const { data: filteredData, isLoading: isLoadingFiltered, error } = useQuery({
    queryKey: ['portfolio', 'list', statusFilter, brandFilter, goalId, pageIndex, pageSize],
    queryFn: () => fetchPortfolioList(apiFilter, { page: pageIndex + 1, pageSize }),
    staleTime: 30_000,
  })

  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['portfolio', 'list', 'all-count'],
    queryFn: () => fetchPortfolioList({ status: 'all' }),
    staleTime: 30_000,
  })

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['portfolio', 'summary', statusFilter, brandFilter, goalId],
    queryFn: () => fetchPortfolioSummary(apiFilter),
    staleTime: 30_000,
  })

  const { data: brandsData } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands, staleTime: 5 * 60_000 })
  const { data: goalsData } = useQuery({ queryKey: ['goals'], queryFn: fetchGoals, staleTime: 5 * 60_000 })

  const allHoldings = filteredData?.items ?? []
  const sortedHoldings = useSortedHoldings(allHoldings, sortBy, sortOrder)

  const viewModels = useMemo(
    () => sortedHoldings.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US')),
    [sortedHoldings, language]
  )

  const summaryViewModel = useMemo(
    () => summaryData ? transformPortfolioSummary(summaryData, t, language === 'id' ? 'id-ID' : 'en-US') : null,
    [summaryData, t, language]
  )

  const isFiltered = useMemo(
    () => brandFilter !== null || statusFilter !== 'active' || goalId !== null || sortBy !== 'date' || sortOrder !== 'desc',
    [brandFilter, statusFilter, goalId, sortBy, sortOrder]
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (brandFilter !== null) count++
    if (statusFilter !== 'active') count++
    if (goalId !== null) count++
    if (sortBy !== 'date' || sortOrder !== 'desc') count++
    return count
  }, [brandFilter, statusFilter, goalId, sortBy, sortOrder])

  if (isLoadingFiltered || isLoadingAll) return <HoldingsListSkeleton />

  if (error || !filteredData || !allData) {
    throw error || new Error('Failed to load holdings')
  }

  const totalHoldingsCount = allData.pagination.totalItems
  const totalFilteredItems = filteredData.pagination.totalItems
  const pageCount = filteredData.pagination.totalPages

  const handleFilterChange = (newFilters: {
    status?: 'active' | 'sold' | 'all'
    brand?: string | null
    goalId?: string | null
    sortBy?: 'date' | 'value'
    sortOrder?: 'asc' | 'desc'
  }) => {
    updateUrl({
      brand: newFilters.brand !== undefined ? newFilters.brand : brandFilter,
      status: newFilters.status || statusFilter,
      goalId: newFilters.goalId !== undefined ? newFilters.goalId : goalId,
      sortBy: newFilters.sortBy || sortBy,
      sortOrder: newFilters.sortOrder || sortOrder,
      pageIndex: 0,
    })
  }

  if (totalHoldingsCount === 0 && !isFiltered) {
    return <HoldingsListEmpty />
  }

  const from = totalFilteredItems > 0 ? pageIndex * pageSize + 1 : 0
  const to = Math.min((pageIndex + 1) * pageSize, totalFilteredItems)

  return (
    <Stack gap="sm">
      {/* Quick Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <PrivacyToggle className="h-9 w-9 border border-border/50 shrink-0" iconClassName="h-4 w-4" />

        {/* Filter button */}
        <ActionChip
          variant={activeFilterCount > 0 ? 'solid' : 'outline'}
          label={t('holdings.filters.title')}
          icon={<SlidersHorizontal className="w-4 h-4" />}
          trailing={activeFilterCount > 0 ? (
            <Typography variant="caption" className="size-4 rounded-full bg-background text-foreground flex items-center justify-center text-2xs font-semibold leading-none">
              {activeFilterCount}
            </Typography>
          ) : undefined}
          onClick={() => setIsFilterModalOpen(true)}
          className="shrink-0"
        />

        <ActionChip
          variant="outline"
          label={t('buybackSimulation.cta')}
          icon={<Calculator className="w-4 h-4" />}
          href={ROUTES.BUYBACK_SIMULATION}
          className="shrink-0"
        />

        {summaryViewModel?.brandAllocation && summaryViewModel.brandAllocation.length > 0 && (
          <ActionChip
            variant="outline"
            label={t('holdings.brandSummary.title')}
            icon={<LayoutGrid className="w-4 h-4" />}
            onClick={() => setIsBrandSummaryOpen(true)}
            className="shrink-0"
          />
        )}
      </div>

      {/* Portfolio Summary */}
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

      {/* Holdings List */}
      <Section>
        {viewModels.length > 0 ? (
          <>
            {/* Mobile: ListRow view */}
            <div className="md:hidden">
              {viewModels.map((holding, index) => (
                <ListRow
                  key={holding.id}
                  leading={<BrandCircle name={holding.brandName} />}
                  title={`${holding.brandName} · ${holding.weight}`}
                  subtitle={holding.buyDate}
                  trailing={
                    <Typography
                      variant="body"
                      className={cn('font-semibold truncate max-w-32', holding.isSold && 'text-muted-foreground')}
                    >
                      {isVisible ? holding.totalValue : '••••••••'}
                    </Typography>
                  }
                  trailingSubtitle={
                    <Stack gap="none" className="items-end">
                      <Typography
                        variant="caption"
                        className={cn(
                          'font-medium truncate max-w-32',
                          holding.pnlColor === 'positive' ? 'text-positive'
                            : holding.pnlColor === 'negative' ? 'text-negative'
                            : 'text-muted-foreground'
                        )}
                      >
                        {isVisible ? holding.pnl : '••••••'}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={cn(
                          'font-medium opacity-80',
                          holding.pnlColor === 'positive' ? 'text-positive'
                            : holding.pnlColor === 'negative' ? 'text-negative'
                            : 'text-muted-foreground'
                        )}
                      >
                        {isVisible ? `(${holding.pnlPercentage})` : '•••%'}
                      </Typography>
                    </Stack>
                  }
                  onClick={() => router.push(ROUTES.HOLDING_DETAIL(holding.id))}
                  showDivider={index < viewModels.length - 1}
                />
              ))}

              {/* Mobile Pagination */}
              <Stack direction="horizontal" className="items-center justify-between pt-4">
                <Typography variant="body-sm" className="text-muted-foreground">
                  {t('holdings.pagination.showing')
                    .replace('{from}', from.toString())
                    .replace('{to}', to.toString())
                    .replace('{total}', totalFilteredItems.toString())}
                </Typography>
                <Stack direction="horizontal" gap="sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(pageIndex - 1, pageSize)}
                    disabled={pageIndex === 0}
                    aria-label={t('holdings.pagination.previous')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(pageIndex + 1, pageSize)}
                    disabled={pageIndex >= pageCount - 1}
                    aria-label={t('holdings.pagination.next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Stack>
              </Stack>
            </div>

            {/* Desktop: Table view */}
            <div className="hidden md:block">
              <HoldingsTable
                holdings={viewModels}
                pageCount={pageCount}
                totalItems={totalFilteredItems}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={(p) => setPagination(p.pageIndex, p.pageSize)}
                isLoading={isLoadingFiltered}
              />
            </div>
          </>
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/50">
            <Typography variant="body" className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
              {t('holdings.noItemsFound')}
            </Typography>
          </div>
        )}
      </Section>

      <div className="h-8" />

      {/* Brand Summary Modal */}
      <BrandSummaryModal
        open={isBrandSummaryOpen}
        onOpenChange={setIsBrandSummaryOpen}
        brands={summaryViewModel?.brandAllocation || []}
      />

      {/* Filter Modal */}
      <FilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        brands={brandsData?.items || []}
        goals={goalsData?.goals || []}
        brandFilter={brandFilter}
        statusFilter={statusFilter}
        goalIdFilter={goalId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApply={(f) => handleFilterChange({
          status: f.status,
          brand: f.brand,
          goalId: f.goalId,
          sortBy: f.sortBy,
          sortOrder: f.sortOrder,
        })}
      />
    </Stack>
  )
}
