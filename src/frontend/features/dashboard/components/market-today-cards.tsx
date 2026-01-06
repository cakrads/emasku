'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Typography } from '@/frontend/components/ui/typography'
import { fetchTodayPrices } from '@/frontend/services/prices/prices.api'
import { transformTodayPrices } from '@/frontend/view-model/prices.vm'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/frontend/config/routes'
import { ErrorBoundary } from '@/frontend/components/fragments/error-boundary'
import { MarketOverviewSkeleton } from './market-overview-skeleton'

function MarketTodayContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices', 'today'],
    queryFn: fetchTodayPrices,
  })

  // Transform data if available
  const viewModel = data ? transformTodayPrices(data) : null

  if (isLoading) {
    return <MarketOverviewSkeleton />
  }

  if (error || !viewModel) {
    throw error || new Error('Failed to load market data')
  }

  // Take top 3 brands for cards
  const previewBrands = viewModel.brands.slice(0, 3)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Typography as="h2" variant="h3">Market Today</Typography>
          <span className="px-2 py-0.5 text-[10px] font-medium bg-accent-gold/10 text-accent-gold rounded-full">
            Today
          </span>
        </div>
        <Link href={ROUTES.PRICES} className="group p-1 hover:bg-muted rounded-full transition-colors hidden lg:block">
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-gold" />
        </Link>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-3 pb-1">
          {previewBrands.map((brand) => {
            // Find 1g price (usually standard reference)
            const price1g = brand.prices.find(p => p.denominationGram === 1)

            return (
              <div
                key={brand.brandName}
                className="group flex flex-col justify-between p-3 rounded-xl border border-border bg-card hover:border-accent-gold/50 hover:shadow-sm transition-all h-[100px] shrink-0 relative overflow-hidden"
              >
                {/* Subtle background gradient hint on hover */}
                <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-1">
                    <Typography variant="caption" className="font-semibold text-muted-foreground group-hover:text-accent-gold transition-colors">
                      {brand.brandName}
                    </Typography>
                    <span className="text-[10px] text-muted-foreground/60">1g</span>
                  </div>
                  <Typography variant="body" className="font-bold -tracking-wide">
                    {price1g?.sellPriceFormatted || '—'}
                  </Typography>
                </div>

                <div className="relative z-10 flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">—</span>
                </div>
              </div>
            )
          })}

          {/* View All Link Card - Mobile/Tablet Only */}
          <Link
            href={ROUTES.PRICES}
            className="group flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-border hover:border-accent-gold hover:bg-accent-gold/5 transition-all h-[100px] gap-2 lg:hidden"
          >
            <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
            <Typography variant="caption" className="font-medium text-muted-foreground group-hover:text-accent-gold">
              View All Prices
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function MarketTodayCards() {
  return (
    <ErrorBoundary>
      <MarketTodayContent />
    </ErrorBoundary>
  )
}
