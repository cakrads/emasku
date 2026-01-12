/**
 * PricesListView - Today Prices Page
 * 
 * Displays current gold prices grouped by brand.
 * Shows SELL and BUYBACK prices in separate columns, ordered by weight.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices, BrandPriceGroupVM } from '@/frontend/view-model/prices.vm'
import { BrandPriceSkeletonSection } from './components/brand-price-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { History } from 'lucide-react'

/**
 * Brand Price Section Component
 */
function BrandPriceSection({ brandName, prices }: BrandPriceGroupVM) {
  const { t } = useLanguage()
  return (
    <div className="mb-8 last:mb-0">
      {/* Brand Header */}
      <div className="bg-accent-gold/10 border border-accent-gold/20 px-6 py-3 rounded-t-lg">
        <Typography variant="h3" className="text-center">
          {brandName} Prices
        </Typography>
      </div>

      {/* Price Table */}
      <div className="border border-border border-t-0 rounded-b-lg overflow-x-auto">
        <table className="w-full min-w-[350px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-3 text-left">
                <Typography variant="body-sm" className="font-medium">
                  {t('prices.table.weight')}
                </Typography>
              </th>
              <th className="px-6 py-3 text-right">
                <Typography variant="body-sm" className="font-medium">
                  {t('prices.table.sell')}
                </Typography>
              </th>
              <th className="px-6 py-3 text-right">
                <Typography variant="body-sm" className="font-medium">
                  {t('prices.table.buyback')}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price, index) => (
              <tr
                key={`${price.denominationGram}-${index}`}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-3">
                  <Typography variant="body">{price.weightLabel}</Typography>
                </td>
                <td className="px-6 py-3 text-right">
                  <Typography variant="body">{price.sellPriceFormatted}</Typography>
                </td>
                <td className="px-6 py-3 text-right">
                  <Typography variant="body">{price.buybackPriceFormatted}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PricesListViewContent() {
  const { t, language } = useLanguage()
  // Fetch prices from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
  })



  // Transform to view model
  const viewModel = data ? transformTodayPrices(data, language === 'id' ? 'id-ID' : 'en-US') : null


  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Skeleton for 4 brand sections */}
        {[1, 2, 3, 4].map((index) => (
          <BrandPriceSkeletonSection key={index} />
        ))}
      </div>
    )
  }


  if (error || !viewModel) {
    throw error || new Error('Failed to load prices')
  }

  // We are already inside the layout in simple cases, 
  // BUT the outer layout needs to know the "Last Updated" description from viewModel.
  // This is tricky: implicit dependency.
  // Ideally, the outer page should fetch data for the title, or we accept generic title on error.

  // Actually, for Prices List, "Today's Prices" is static title.
  // The description "Latest update: ..." depends on data.
  // If we move layout out, we can't set dynamic description easily from inside without context/state lift.

  // Option 1: Use generic description in outer layout.
  // Option 2: Lift data fetching (but then we handle error manually? No, we want ErrorBoundary).

  // Let's fallback to generic description "Market Rates" in outer layout.
  // And rendering dynamic description is harder if layout is fixed outside.
  // Wait, StandardPageLayout renders title/desc.
  // If I put StandardPageLayout outside, I set title/desc there.
  // I can't update it from inside easily.

  // Compromise:
  // Outer Layout: Title "Today's Prices", Description "Current market rates for gold bars."
  // Inner content just renders the list.

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center -mb-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href={ROUTES.PRICES_HISTORY} className="flex items-center gap-2">
            <History className="w-4 h-4" />
            {t('prices.viewHistory')}
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground text-right">
          {t('dashboard.lastUpdated')}: {viewModel.lastUpdated}
        </div>
      </div>

      {/* Brand Sections */}
      {viewModel.brands.map((brandData) => (
        <BrandPriceSection
          key={brandData.brandName}
          brandName={brandData.brandName}
          prices={brandData.prices}
        />
      ))}
    </div>
  )
}

export function PricesListView() {
  const { t } = useLanguage()
  return (
    <StandardPageLayout
      title={t('prices.title')}
      description={t('prices.description')}
      breadcrumbs={[{ label: t('navbar.dashboard'), href: ROUTES.DASHBOARD }, { label: t('navbar.prices') }]}
    >
      <ErrorBoundary>
        <PricesListViewContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
