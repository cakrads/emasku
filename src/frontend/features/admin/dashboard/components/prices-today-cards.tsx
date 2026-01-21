'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/frontend/config/routes'
import { ErrorBoundary } from '@/frontend/components/fragments/admin/error-boundary'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/frontend/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Info } from 'lucide-react'
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

  // Take top 6 brands for a better overview
  const previewBrands = viewModel.brands.slice(0, 6)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex flex-col">
          <Typography as="h2" variant="h3">{t('dashboard.marketToday')}</Typography>
          <Typography variant="caption" className="text-(--text-muted)">
            {t('dashboard.marketTodaySubtitle')}
          </Typography>
        </div>
        <Link href={ROUTES.PRICES} className="group p-1 hover:bg-muted rounded-full transition-colors hidden lg:block">
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-gold" />
        </Link>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0 pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-3 pb-3">
          {previewBrands.map((brand, index) => {
            // Find 1g price (usually standard reference)
            const price1g = brand.prices.find(p => p.denominationGram === 1)

            const DeltaIndicator = ({ delta, deltaPercentage }: { delta: number, deltaPercentage: number | null }) => (
              <div className="flex items-center gap-1 cursor-help w-fit">
                <span className={delta > 0 ? "text-[10px] text-(--positive) font-semibold" : delta < 0 ? "text-[10px] text-(--negative) font-semibold" : "text-[10px] text-muted-foreground/60 font-semibold"}>
                  {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} Rp {Math.abs(delta).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
                  {deltaPercentage !== null && ` (${deltaPercentage > 0 ? '+' : ''}${deltaPercentage.toFixed(2)}%)`}
                </span>
                <Info className="w-3 h-3 text-muted-foreground/40" />
              </div>
            )

            return (
              <div
                key={brand.brandName}
                className={`group flex flex-col justify-between p-3 rounded-xl border border-border bg-card hover:border-accent-gold/50 hover:bg-accent-gold/5 hover:shadow-sm transition-all h-[100px] shrink-0 ${index >= 3 ? 'hidden md:flex' : 'flex'}`}
              >
                {/* Header: Brand + Weight */}
                <div className="flex justify-between items-start">
                  <Typography variant="caption" className="font-semibold text-muted-foreground group-hover:text-accent-gold transition-colors">
                    {brand.brandName}
                  </Typography>
                  <span className="text-[10px] text-muted-foreground/60">1g</span>
                </div>

                {/* Price + Delta grouped together */}
                <div className="flex flex-col gap-1.5 mb-1">
                  <Typography variant="body" className="font-bold -tracking-wide">
                    {price1g?.sellPriceFormatted || '—'}
                  </Typography>

                  {price1g?.sellDelta !== null && price1g?.sellDelta !== undefined && (
                    <>
                      {/* Desktop: Tooltip (hover) */}
                      <div className="hidden md:block">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div><DeltaIndicator delta={price1g.sellDelta} deltaPercentage={price1g.sellDeltaPercentage} /></div>
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

          {/* View All Link Card - Now visible on all screens as requested */}
          <Link
            href={ROUTES.PRICES}
            className="group flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-border hover:border-accent-gold hover:bg-accent-gold/5 transition-all h-[100px] lg:h-[80px] gap-2 lg:flex-row lg:justify-start lg:px-6"
          >
            <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-white transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
            <Typography variant="caption" className="font-medium text-muted-foreground group-hover:text-accent-gold">
              {t('dashboard.viewAllPrices')}
            </Typography>
          </Link>
        </div>
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
