'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { ArrowRight, Info } from 'lucide-react'
import { ROUTES } from '@/frontend/config/routes'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/frontend/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { useLanguage } from '@/frontend/hooks/use-language'
import { PricesOverviewSkeleton } from './prices-overview-skeleton'

function PricesTodayContent() {
  const { t, language } = useLanguage()
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
  })

  // Transform data if available
  const viewModel = data ? transformTodayPrices(data, language === 'id' ? 'id-ID' : 'en-US') : null

  if (isLoading) {
    return <PricesOverviewSkeleton />
  }

  if (error || !viewModel) {
    throw error || new Error('Failed to load market data')
  }

  // Take top 5 brands for horizontal row
  const previewBrands = viewModel.brands.slice(0, 5)

  const DeltaIndicator = ({ delta, deltaPercentage }: { delta: number, deltaPercentage: number | null }) => (
    <div className="flex items-center gap-1 cursor-help w-fit">
      <span className={delta > 0 ? "text-[10px] text-positive font-semibold" : delta < 0 ? "text-[10px] text-negative font-semibold" : "text-[10px] text-muted-foreground/60 font-semibold"}>
        {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} Rp {Math.abs(delta).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
        {deltaPercentage !== null && ` (${deltaPercentage > 0 ? '+' : ''}${deltaPercentage.toFixed(2)}%)`}
      </span>
      <Info className="w-3 h-3 text-muted-foreground/40" />
    </div>
  )

  return (
    <div className="min-h-[180px] md:min-h-[170px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <Typography as="h2" variant="body" className="font-semibold">{t('dashboard.marketToday')}</Typography>
          <Typography variant="caption" className="text-muted-foreground text-xs">
            {t('dashboard.marketTodaySubtitle')}
          </Typography>
        </div>
        <Link href={ROUTES.PRICES} className="group flex items-center gap-1 text-sm font-medium text-accent-gold hover:text-accent-gold/80 transition-colors">
          <span className="hidden md:inline">{t('dashboard.viewAllPrices')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Grid of Brand Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewBrands.map((brand) => {
          // Find 1g price (usually standard reference)
          const price1g = brand.prices.find(p => p.denominationGram === 1)

          return (
            <div
              key={brand.brandName}
              className="group flex flex-col text-left justify-between p-4 rounded-xl border border-border bg-background hover:border-accent-gold/50 hover:bg-accent-gold/5 hover:shadow-sm transition-all h-[110px]"
            >
              {/* Header: Brand */}
              <Typography variant="caption" className="text-xs font-medium text-muted-foreground group-hover:text-accent-gold transition-colors truncate">
                {brand.brandName}
              </Typography>

              {/* Price + Delta */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight">
                    {price1g?.sellPriceFormatted || '—'}
                  </span>
                  <span className="text-xs text-muted-foreground">/gram</span>
                </div>

                {price1g?.sellDelta !== null && price1g?.sellDelta !== undefined && (
                  <>
                    {/* Desktop: Tooltip (hover) */}
                    <div className="hidden md:block">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-fit"><DeltaIndicator delta={price1g.sellDelta} deltaPercentage={price1g.sellDeltaPercentage} /></div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{t('dashboard.marketPriceTooltip')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Mobile: Popover (click) */}
                    <div className="block md:hidden">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="outline-none">
                            <DeltaIndicator delta={price1g.sellDelta} deltaPercentage={price1g.sellDeltaPercentage} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 mx-4" sideOffset={8} collisionPadding={16}>
                          <p className="text-sm text-muted-foreground">{t('dashboard.marketPriceTooltip')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}


      </div>
    </div>
  )
}

export function PricesTodayCards() {
  return (
    <ErrorBoundary>
      <PricesTodayContent />
    </ErrorBoundary>
  )
}
