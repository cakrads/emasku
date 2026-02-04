'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { useUrlFilters } from '@/frontend/hooks/use-url-filters'
import { useBuybackSimulation } from './hooks/use-buyback-simulation'
import { HeaderSummary } from './components/header-summary'
import { HoldingsSelector } from './components/holdings-selector'
import { HoldingsSelectorMobile } from './components/holdings-selector-mobile'
import { SimulationBreakdown } from './components/simulation-breakdown'
import { ROUTES } from '@/frontend/config/routes'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'

function BuybackSimulationContent() {
  const { t, language } = useLanguage()

  // URL State for pagination
  const { filters, setPagination } = useUrlFilters({
    pageIndex: 0,
    pageSize: 10
  })

  // Fetch Holdings (Active only)
  const apiFilter = {
    status: 'active' as const,
    pageIndex: filters.pageIndex,
    pageSize: filters.pageSize,
    sortBy: 'date' as const,
    sortOrder: 'desc' as const
  }

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', 'list', apiFilter],
    queryFn: () => fetchPortfolioList(apiFilter),
  })

  // Transform Data
  const holdings = useMemo(() =>
    data?.items.map(item => transformHoldingItem(item, language === 'id' ? 'id-ID' : 'en-US')) || [],
    [data, language]
  )
  const totalItems = data?.pagination.totalItems || 0
  const pageCount = data?.pagination.totalPages || 0

  // Hook
  const {
    selectedIds,
    selectedItems,
    quantityOverrides,
    toggleSelection,
    updateQuantity,
    resetSelection,
    summary,
    priceMap
  } = useBuybackSimulation(holdings)

  return (
    <>
      <HeaderSummary
        summary={summary}
        onReset={resetSelection}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Selector Table */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {t('buybackSimulation.table.select')}
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <HoldingsSelector
                holdings={holdings}
                selectedIds={selectedIds}
                quantityOverrides={quantityOverrides}
                priceMap={priceMap}
                onToggle={toggleSelection}
                onUpdateQuantity={updateQuantity}
                pagination={{ pageIndex: filters.pageIndex, pageSize: filters.pageSize }}
                totalItems={totalItems}
                pageCount={pageCount}
                onPaginationChange={(p) => setPagination(p.pageIndex, p.pageSize)}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile List */}
            <div className="block md:hidden">
              <HoldingsSelectorMobile
                holdings={holdings}
                selectedIds={selectedIds}
                quantityOverrides={quantityOverrides}
                priceMap={priceMap}
                onToggle={toggleSelection}
                onUpdateQuantity={updateQuantity}
                pagination={{ pageIndex: filters.pageIndex, pageSize: filters.pageSize }}
                totalItems={totalItems}
                pageCount={pageCount}
                onPaginationChange={(p) => setPagination(p.pageIndex, p.pageSize)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-40 space-y-4">
            <SimulationBreakdown
              selectedItems={selectedItems}
              quantityOverrides={quantityOverrides}
              priceMap={priceMap}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function BuybackSimulationView() {
  const { t } = useLanguage()

  return (
    <StandardPageLayout
      title={t('buybackSimulation.title')}
      description={t('buybackSimulation.description')}
      breadcrumbs={[
        { label: t('navbar.dashboard'), href: ROUTES.DASHBOARD },
        { label: t('navbar.holdings'), href: ROUTES.HOLDINGS_LIST },
        { label: t('buybackSimulation.title') }
      ]}
    >
      <ErrorBoundary>
        <BuybackSimulationContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
