/**
 * PricesHistoryView - Price History Chart Page
 * 
 * Displays historical gold price movement for ANTAM SELL 1g.
 * This is a reference benchmark, not personalized to user portfolio.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { PriceHistoryChart } from '@/frontend/features/public/prices-history/components/price-history-chart'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'
import { fetchSpotPriceSeries } from '@/frontend/services/prices/prices.api'
import { PricesHistorySkeleton } from './components/prices-history-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'

import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/frontend/components/ui/tooltip'

function PricesHistoryContent() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  // Use predefined range instead of arbitrary dates (anti-scraping)
  const range = '5y' as const

  const { data, isLoading, error } = useQuery({
    queryKey: ['market', 'market-prices', 'ANTAM', '1g', range],
    queryFn: () => fetchSpotPriceSeries({
      brand: 'ANTAM',
      range,
      denomination: 1,
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
  const chartData = data.series.map((point) => ({
    timestamp: point.priceAt, // ISO string
    price: point.price,
  }))

  // Get latest price point
  const lastPoint = chartData[chartData.length - 1]
  const currentPrice = lastPoint ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(lastPoint.price) : '-'
  const lastUpdated = lastPoint ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastPoint.timestamp)) : '-'

  // Calculate Context (30-day average)
  // Assuming 1 point per day, take last 30 points
  const last30Points = chartData.slice(-30)
  const avg30Day = last30Points.reduce((acc, curr) => acc + curr.price, 0) / last30Points.length

  let priceContext = ""
  if (lastPoint && avg30Day) {
    if (lastPoint.price > avg30Day) {
      priceContext = language === 'id' ? "Lebih tinggi dari rata-rata 30 hari terakhir" : "Higher than 30-day average"
    } else {
      priceContext = language === 'id' ? "Lebih rendah dari rata-rata 30 hari terakhir" : "Lower than 30-day average"
    }
  }

  return (
    <div className="flex flex-col">
      {/* Current Price Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-1">
          <Typography variant="caption" className="text-muted-foreground font-medium uppercase tracking-wider">
            Antam Logam Mulia · 1 g
          </Typography>

          <div className="flex items-baseline gap-2">
            <Typography variant="h1" className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
              {currentPrice}
            </Typography>
          </div>

          {/* Price Context */}
          {priceContext && (
            <Typography variant="caption" className="text-muted-foreground/80 text-sm mt-1 block">
              {priceContext}
            </Typography>
          )}

          <div className="flex items-center gap-2 mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span className="text-xs font-medium">
                {language === 'id' ? 'Harga pasar diperbarui' : 'Market price updated'}: {lastUpdated}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 opacity-70 hover:opacity-100 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <p className="text-xs">
                      {language === 'id'
                        ? 'Waktu update resmi dari sumber harga, bukan waktu refresh halaman'
                        : 'Official update time from price source, not page refresh time'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <PriceHistoryChart
          data={chartData}
          height={400}
          locale={locale}
          referenceLine={lastPoint ? {
            x: lastPoint.timestamp,
            label: language === 'id' ? 'Hari ini' : 'Today',
            stroke: '#D4AF37'
          } : undefined}
        />
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <Typography variant="body-sm" className="text-muted-foreground">
          {t('priceHistory.referenceNote').replace('{date}', chartData[0]?.timestamp
            ? new Date(chartData[0].timestamp).toLocaleDateString(locale, { dateStyle: 'long' })
            : '-'
          )}
        </Typography>
      </div>
    </div>
  )
}

export function PricesHistoryView() {
  const { t } = useLanguage()

  return (
    <StandardPageLayout
      breadcrumbs={[
        { label: t('common.home'), href: ROUTES.HOME },
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
