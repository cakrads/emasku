'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Card } from '@/frontend/components/ui/card'
import { Button } from '@/frontend/components/ui/button'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Plus, ArrowRight, Coins, TrendingUp } from 'lucide-react'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem, HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { ROUTES } from '@/frontend/config/routes'
import { cn } from '@/frontend/utils/cn'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

/**
 * Grouped Holding Item for Display
 */
interface GroupedHoldingItem extends HoldingItemVM {
  count: number
}

/**
 * Holdings Preview component for Dashboard.
 * Shows the 5 most recent holdings in a simplified read-only list.
 * Uses same data fetching pattern as holdings-list but with minimal display.
 */
export default function HoldingsPreview() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  // Fetch latest 5 holdings (active only, sorted by newest)
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'list', 'preview'],
    queryFn: () => fetchPortfolioList({ status: 'active' }, { page: 1, pageSize: 5 }),
  })

  // Transform to view models
  const rawHoldings: HoldingItemVM[] = data?.items
    ? data.items.map(item => transformHoldingItem(item, locale))
    : []

  // Grouping Logic
  const groupedHoldings: GroupedHoldingItem[] = []
  rawHoldings.forEach((item) => {
    const last = groupedHoldings[groupedHoldings.length - 1]

    // Check for grouping criteria: Brand, Weight, Buy Price, Buy Date
    const isSameGroup = last &&
      last.brand === item.brand &&
      last.weight === item.weight &&
      last.avgBuyPrice === item.avgBuyPrice &&
      last.buyDate === item.buyDate

    if (isSameGroup) {
      last.count += 1
    } else {
      groupedHoldings.push({ ...item, count: 1 })
    }
  })

  // Loading State
  if (isLoading) {
    return <HoldingsPreviewSkeleton />
  }

  // Error State (silent, just show empty)
  if (error) {
    return null
  }

  // Empty State
  if (groupedHoldings.length === 0) {
    return <HoldingsPreviewEmpty />
  }

  return (
    <Stack gap="sm">
      <Typography variant="h3">{t('dashboard.recentHoldings')}</Typography>

      <Card className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50">
        <Stack gap="none">
          {groupedHoldings.map((holding, index) => (
            <HoldingPreviewItem
              key={`${holding.id}-${index}`}
              holding={holding}
              isLast={index === groupedHoldings.length - 1}
            />
          ))}
        </Stack>

        {/* CTA to view all */}
        <div className="mt-4 pt-3 border-t border-border">
          <Link href={ROUTES.HOLDINGS_LIST}>
            <Button variant="ghost" size="sm" className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground">
              <span>{t('dashboard.viewAllHoldings')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </Stack>
  )
}

/**
 * Single holding item in preview list.
 * Read-only, no click handlers.
 */
function HoldingPreviewItem({
  holding,
  isLast
}: {
  holding: GroupedHoldingItem
  isLast: boolean
}) {
  const { t } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()
  const hasValuation = holding.totalValue !== '-'
  const isPositive = holding.pnlColor === 'positive'
  const isNegative = holding.pnlColor === 'negative'

  return (
    <div className={`py-3 ${!isLast ? 'border-b border-border/50' : ''}`}>
      <div className="flex flex-col gap-1">

        {/* Row 1: Brand · Weight (xN) */}
        <Typography variant="body-sm" className="font-medium block">
          {holding.brandName} · {holding.weight}
          {holding.count > 1 && (
            <span className="ml-1 text-muted-foreground font-normal">
              (x{holding.count})
            </span>
          )}
        </Typography>

        {/* Row 2: Date · Price */}
        <Typography variant="caption" className="text-muted-foreground block">
          {t('dashboard.purchasedOn')} {holding.buyDate} · {isVisible ? holding.totalBuyValue : '••••••'}
        </Typography>

        {/* Row 3: Estimated Sell & PnL */}
        <div className="flex items-center gap-1.5 text-xs mt-0.5">
          {hasValuation ? (
            <>
              <span className="text-muted-foreground">
                {t('dashboard.estimatedSell')}:
              </span>
              <span className="font-medium text-foreground">
                {isVisible ? holding.totalValue : '••••••'}
              </span>

              {/* PnL Indicator */}
              <div className={cn(
                "flex items-center gap-0.5 ml-1 font-medium",
                isPositive && "text-positive",
                isNegative && "text-negative",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                <TrendingUp className={cn(
                  "w-3 h-3",
                  isNegative && "rotate-180" // Down arrow for loss
                )} />
                <span>{isVisible ? `${holding.pnl} (${holding.pnlPercentage})` : '••••••'}</span>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground italic">
              {t('dashboard.valuationUnavailable')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Empty state for Holdings Preview.
 */
function HoldingsPreviewEmpty() {
  const { t } = useLanguage()

  return (
    <Stack gap="sm">
      <Typography variant="h3">{t('dashboard.recentHoldings')}</Typography>

      <Card className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <Coins className="w-6 h-6 text-muted-foreground" />
          </div>

          <Stack gap="xs" className="items-center">
            <Typography variant="body-sm" className="text-muted-foreground">
              {t('dashboard.noHoldingsYet')}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground/70 max-w-xs">
              {t('dashboard.addFirstHoldingPrompt')}
            </Typography>
          </Stack>

          <Link href={ROUTES.ADD_HOLDING}>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>{t('dashboard.addFirstHolding')}</span>
            </Button>
          </Link>
        </div>
      </Card>
    </Stack>
  )
}

/**
 * Skeleton loader for Holdings Preview.
 */
function HoldingsPreviewSkeleton() {
  return (
    <Stack gap="sm">
      <Skeleton className="h-7 w-40" />
      <Card className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50">
        <Stack gap="none">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`py-3 ${i < 3 ? 'border-b border-(--border)/50' : ''}`}>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </Stack>
        <div className="mt-4 pt-3 border-t border-(--border)">
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
    </Stack>
  )
}
