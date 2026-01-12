/**
 * PricesHistoryView - Price History Chart Page
 * 
 * Displays historical gold price movement for ANTAM SPOT 1g.
 * This is a reference benchmark, not personalized to user portfolio.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { PriceHistoryChart } from '@/frontend/components/fragments/price-history-chart'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'
import { fetchSpotPriceSeries } from '@/frontend/services/prices/prices.api'
import { PricesHistorySkeleton } from './components/prices-history-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'

function PricesHistoryContent() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'
  // Calculate date range (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  const to = endDate.toISOString().split('T')[0]
  const from = startDate.toISOString().split('T')[0]

  const { data, isLoading, error } = useQuery({
    queryKey: ['market', 'spot-prices', 'ANTAM', '1g', from, to],
    queryFn: () => fetchSpotPriceSeries({
      brand: 'ANTAM',
      denomination: 1,
      from,
      to,
    }),
  })

  if (isLoading) {
    return (
      <PricesHistorySkeleton />
    )
  }

  if (error || !data) {
    throw error || new Error('Failed to load price history')
  }

  // Transform data for the chart
  // Chart expects { timestamp: string, price: number }
  const chartData = data.series.map((point) => ({
    timestamp: point.priceAt, // ISO string
    price: point.price,
  }))

  return (
    <div className="flex flex-col">
      {/* Chart Section */}
      {/* Chart Section */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <PriceHistoryChart data={chartData} height={400} locale={locale} />
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <Typography variant="body-sm" className="text-muted-foreground">
          {t('priceHistory.referenceNote').replace('{date}', new Date(from).toLocaleDateString(locale, { dateStyle: 'long' }))}
        </Typography>
      </div>
    </div>
  )
}

export function PricesHistoryView() {
  const { t } = useLanguage()

  return (
    <StandardPageLayout
      title={t('priceHistory.title')}
      description={t('priceHistory.description')}
      breadcrumbs={[
        { label: 'Home', href: ROUTES.DASHBOARD },
        { label: t('navbar.prices'), href: ROUTES.PRICES },
        { label: t('priceHistory.breadcrumbs.history') }
      ]}
    >
      <ErrorBoundary>
        <PricesHistoryContent />
      </ErrorBoundary>
    </StandardPageLayout>
  )
}
