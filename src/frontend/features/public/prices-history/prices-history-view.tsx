/**
 * PricesHistoryView - Price History Chart Page
 * 
 * Displays historical gold price movement for ANTAM SELL 1g.
 * This is a reference benchmark, not personalized to user portfolio.
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { Stack } from '@/frontend/components/ui/layout'
import { PriceHistoryChart } from '@/frontend/features/public/prices-history/components/price-history-chart'
import { StandardPageLayout } from '@/frontend/components/layout/standard-page-layout'
import { ROUTES } from '@/frontend/config/routes'
import { fetchSpotPriceSeries } from '@/frontend/services/prices/prices.api'
import { PricesHistorySkeleton } from './components/prices-history-skeleton'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'

import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/frontend/components/ui/tooltip'

type TimeRange = '3d' | '1w' | '1m' | '1y' | 'all'

function RangeSelector({ current, onChange, language }: { current: TimeRange, onChange: (r: TimeRange) => void, language: string }) {
  const ranges: { label: string, value: TimeRange }[] = [
    { label: '3D', value: '3d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: '1Y', value: '1y' },
    { label: language === 'id' ? 'SEMUA' : 'ALL', value: 'all' },
  ]

  return (
    <div className="flex p-1 bg-muted/50 rounded-lg items-center gap-1 w-fit mb-6 overflow-x-auto no-scrollbar" role="group">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={cn(
            "px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 cursor-pointer",
            current === r.value
              ? "bg-background text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}


import { SpotPriceSeries } from '@/shared/contracts/prices.contract'

function PricesHistoryContent() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  const [range, setRange] = useState<TimeRange>('1m')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Trigger artificial loading on range change
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 400)
    return () => clearTimeout(timer)
  }, [range])

  const { data: allData, isLoading, error } = useQuery<SpotPriceSeries, Error>({
    queryKey: ['market', 'market-prices', 'ANTAM', '1g', '5y'],
    queryFn: () => fetchSpotPriceSeries({
      brand: 'ANTAM',
      range: '5y',
      denomination: 1,
    }),
  })

  // Filter data for the chart client-side
  const chartData = useMemo(() => {
    if (!allData) return []
    const series = allData.series.map((point) => ({
      timestamp: point.priceAt, // ISO string
      price: point.price,
    }))

    if (range === 'all') return series

    const now = new Date()
    const cutoff = new Date()
    if (range === '3d') cutoff.setDate(now.getDate() - 3)
    else if (range === '1w') cutoff.setDate(now.getDate() - 7)
    else if (range === '1m') cutoff.setMonth(now.getMonth() - 1)
    else if (range === '1y') cutoff.setFullYear(now.getFullYear() - 1)

    return series.filter(point => new Date(point.timestamp) >= cutoff)
  }, [allData, range])

  if (isLoading || isTransitioning) {
    return (
      <Stack direction="vertical">
        <PricesHistorySkeleton />
      </Stack>
    )
  }

  if (error || !allData) {
    throw error || new Error('Failed to load price history')
  }

  // Get latest price point
  const lastPoint = chartData[chartData.length - 1]
  const currentPrice = lastPoint ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(lastPoint.price) : '-'
  const lastUpdated = lastPoint ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(lastPoint.timestamp)) : '-'

  // Calculate Context (30-day average) - Use full data if possible for better accuracy
  const last30Days = allData.series
    .map(p => ({ timestamp: p.priceAt, price: p.price }))
    .filter(p => {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 30)
      return new Date(p.timestamp) >= cutoff
    })

  const avg30Day = last30Days.reduce((acc, curr) => acc + curr.price, 0) / (last30Days.length || 1)

  let priceContext = ""
  if (lastPoint && avg30Day) {
    if (lastPoint.price > avg30Day) {
      priceContext = language === 'id' ? "Lebih tinggi dari rata-rata 30 hari terakhir" : "Higher than 30-day average"
    } else {
      priceContext = language === 'id' ? "Lebih rendah dari rata-rata 30 hari terakhir" : "Lower than 30-day average"
    }
  }

  return (
    <Stack direction="vertical" gap="none">
      {/* Current Price Header */}
      <Stack direction="vertical" className="mb-8">
        <Stack direction="vertical" gap="xs">
          <Typography variant="caption" className="text-muted-foreground font-medium uppercase tracking-wider">
            {t('priceHistory.description')}
          </Typography>

          <Stack direction="horizontal" gap="sm" className="items-baseline">
            <Typography variant="h1" className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
              {currentPrice}
            </Typography>
          </Stack>

          {/* Price Context */}
          {priceContext && (
            <Typography variant="caption" className="text-muted-foreground/80 text-sm mt-1 block">
              {priceContext}
            </Typography>
          )}

          <Stack direction="horizontal" gap="sm" className="items-center mt-4">
            <Stack direction="horizontal" gap="xs" className="items-center px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
              <Stack direction="horizontal" className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <Typography variant="caption" className="text-xs font-medium">
                {language === 'id' ? 'Harga pasar diperbarui' : 'Market price updated'}: {lastUpdated}
              </Typography>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 opacity-70 hover:opacity-100 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <Typography variant="caption">
                      {language === 'id'
                        ? 'Waktu update resmi dari sumber harga, bukan waktu refresh halaman'
                        : 'Official update time from price source, not page refresh time'}
                    </Typography>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Range Selector */}
      <RangeSelector current={range} onChange={setRange} language={language} />

      {/* Chart Section - overflow-hidden is an exception */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-2 md:p-6 mb-8 overflow-hidden">
        <PriceHistoryChart
          data={chartData}
          range={range}
          height={400}
          locale={locale}
          referenceLine={lastPoint && range !== '3d' ? {
            x: lastPoint.timestamp,
            label: language === 'id' ? 'Hari ini' : 'Today',
            stroke: '#D4AF37'
          } : undefined}
        />
      </div>

      {/* Footer Note */}
      <Stack direction="horizontal" className="justify-center px-4">
        <Typography variant="body-sm" className="text-muted-foreground leading-relaxed text-center">
          {t('priceHistory.referenceNote')}
        </Typography>
      </Stack>
    </Stack>
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
