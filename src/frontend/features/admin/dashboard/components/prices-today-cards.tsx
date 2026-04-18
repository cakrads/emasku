'use client'

import { useQuery } from '@tanstack/react-query'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { Info } from 'lucide-react'
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
    staleTime: 5 * 60_000,
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
    <Stack direction="horizontal" gap="xs" className="items-center cursor-help w-fit">
      <span className={delta > 0 ? "text-2xs text-positive font-semibold" : delta < 0 ? "text-2xs text-negative font-semibold" : "text-2xs text-muted-foreground/60 font-semibold"}>
        {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} Rp {Math.abs(delta).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}
        {deltaPercentage !== null && ` (${deltaPercentage > 0 ? '+' : ''}${deltaPercentage.toFixed(2)}%)`}
      </span>
      <Info className="w-3 h-3 text-muted-foreground/40" />
    </Stack>
  )

  return (
    <Stack className="min-h-[240px] md:min-h-[220px]">
      {/* Header */}
      <SectionHeader
        title={t('dashboard.marketToday')}
        actionLabel={t('dashboard.viewAllPrices')}
        href={ROUTES.PRICES}
      />

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 hide-scrollbar">
        {previewBrands.map((brand) => {
          // Find 1g price (usually standard reference)
          const price1g = brand.prices.find(p => p.denominationGram === 1)

          return (
            <Stack
              key={brand.brandName}
              className="shrink-0 w-[85%] max-w-[280px] snap-center md:w-auto md:max-w-none md:snap-none group text-left justify-between p-4 rounded-xl border border-border bg-background hover:border-accent-gold/50 hover:bg-accent-gold/5 hover:shadow-sm transition-all min-h-[180px]"
            >
              {/* Header: Brand */}
              <Typography variant="caption" className="text-xs font-medium text-muted-foreground group-hover:text-accent-gold transition-colors truncate mb-3">
                {brand.brandName}
              </Typography>

              <Stack gap="md">
                {/* Harga Beli Section */}
                <Stack gap="xs">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dashboard.brandCard.buyPrice')}</span>
                  <Stack direction="horizontal" gap="xs" className="items-baseline">
                    <span className="text-lg font-bold tracking-tight">
                      {price1g?.sellPriceFormatted || '—'}
                    </span>
                    <span className="text-2xs text-muted-foreground">/gram</span>
                  </Stack>

                  {price1g?.sellDelta !== null && price1g?.sellDelta !== undefined && (
                    <Stack className="mt-0.5">
                      {/* Tooltip logic for desktop */}
                      <Stack className="hidden md:flex">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Stack className="w-fit"><DeltaIndicator delta={price1g.sellDelta} deltaPercentage={price1g.sellDeltaPercentage} /></Stack>
                            </TooltipTrigger>
                            <TooltipContent>
                              <Typography variant="caption">{t('dashboard.marketPriceTooltip')}</Typography>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Stack>
                      {/* Popover logic for mobile */}
                      <Stack className="flex md:hidden">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm">
                              <DeltaIndicator delta={price1g.sellDelta} deltaPercentage={price1g.sellDeltaPercentage} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 mx-4" sideOffset={8} collisionPadding={16}>
                            <Typography variant="body-sm" className="text-muted-foreground">{t('dashboard.marketPriceTooltip')}</Typography>
                          </PopoverContent>
                        </Popover>
                      </Stack>
                    </Stack>
                  )}
                </Stack>

                {/* Harga Jual Section */}
                <Stack gap="xs">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dashboard.brandCard.sellPrice')}</span>
                  <Stack direction="horizontal" gap="xs" className="items-baseline">
                    <span className="text-lg font-bold tracking-tight">
                      {price1g?.buybackPriceFormatted || '—'}
                    </span>
                    <span className="text-2xs text-muted-foreground">/gram</span>
                  </Stack>

                  {price1g?.buybackDelta !== null && price1g?.buybackDelta !== undefined && (
                    <Stack className="mt-0.5">
                      {/* Tooltip logic for desktop */}
                      <Stack className="hidden md:flex">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Stack className="w-fit"><DeltaIndicator delta={price1g.buybackDelta} deltaPercentage={price1g.buybackDeltaPercentage} /></Stack>
                            </TooltipTrigger>
                            <TooltipContent>
                              <Typography variant="caption">{t('dashboard.marketPriceTooltip')}</Typography>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Stack>
                      {/* Popover logic for mobile */}
                      <Stack className="flex md:hidden">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm">
                              <DeltaIndicator delta={price1g.buybackDelta} deltaPercentage={price1g.buybackDeltaPercentage} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 mx-4" sideOffset={8} collisionPadding={16}>
                            <Typography variant="body-sm" className="text-muted-foreground">{t('dashboard.marketPriceTooltip')}</Typography>
                          </PopoverContent>
                        </Popover>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Stack>
          )
        })}


      </div>
    </Stack>
  )
}

export function PricesTodayCards() {
  return (
    <ErrorBoundary>
      <PricesTodayContent />
    </ErrorBoundary>
  )
}
