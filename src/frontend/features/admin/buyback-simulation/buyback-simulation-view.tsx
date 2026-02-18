'use client'

import { useMemo, useState } from 'react'
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bulkSellHoldings } from '@/frontend/services/portfolio/portfolio.api'
import { BulkSellModal } from './components/bulk-sell-modal'
import { FloatingSummaryBar } from './components/floating-summary-bar'

function BuybackSimulationContent() {
  const { t, language } = useLanguage()
  const queryClient = useQueryClient()
  const [showBulkSellModal, setShowBulkSellModal] = useState(false)

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

  // Bulk Sell Mutation
  const bulkSellMutation = useMutation({
    mutationFn: (data: { items: { id: string; sellPrice: number }[]; sellDate: string; notes?: string }) =>
      bulkSellHoldings(data),
    onSuccess: (result) => {
      const soldCount = result.results.filter((r: any) => r.status === 'SOLD').length
      const failedCount = result.results.filter((r: any) => r.status === 'FAILED').length

      if (soldCount > 0) {
        toast.success(t('holdingDetail.messages.soldSuccess'), {
          description: t('buybackSimulation.messages.bulkSellSuccess', { count: soldCount })
        })
      }

      if (failedCount > 0) {
        toast.error(t('common.errorTitle'), {
          description: t('buybackSimulation.messages.bulkSellPartialError', { count: failedCount })
        })
      }

      setShowBulkSellModal(false)
      resetSelection()
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['holdings'] })
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string, description?: string, errorType?: string, title?: string }

      // If generic conflict, refresh data
      if (apiError?.errorType === 'ConflictError') {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] })
        setShowBulkSellModal(false)
      }

      toast.error(apiError?.title || t('common.errorTitle'), {
        description: apiError?.description || apiError?.message || t('buybackSimulation.messages.bulkSellError'),
        duration: 4000,
      })
    }
  })

  const handleBulkSellConfirm = (data: { items: { id: string; sellPrice: number }[]; sellDate: string; notes?: string }) => {
    bulkSellMutation.mutate(data)
  }

  return (
    <>
      <HeaderSummary
        summary={summary}
        onReset={resetSelection}
        onSell={() => setShowBulkSellModal(true)}
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

      <BulkSellModal
        open={showBulkSellModal}
        onOpenChange={setShowBulkSellModal}
        selectedItems={selectedItems}
        quantityOverrides={quantityOverrides}
        priceMap={priceMap}
        onConfirm={handleBulkSellConfirm}
        isPending={bulkSellMutation.isPending}
      />

      <FloatingSummaryBar
        summary={summary}
        onReset={resetSelection}
        onSell={() => setShowBulkSellModal(true)}
      />
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
