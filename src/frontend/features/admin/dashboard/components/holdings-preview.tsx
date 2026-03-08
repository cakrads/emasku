'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { ListRow } from '@/frontend/components/ui/list-row'
import { Button } from '@/frontend/components/ui/button'
import { Plus, Coins, AlertCircle } from 'lucide-react'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem, HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { ROUTES } from '@/frontend/config/routes'
import { cn } from '@/frontend/utils/cn'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

interface GroupedHoldingItem extends HoldingItemVM {
  count: number
  _rawTotalBuyValue: number
  _rawTotalValue: number | null
  _rawPnl: number | null
}

export default function HoldingsPreview() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'
  const [hydrated, setHydrated] = useState(false)
  const { isVisible } = usePortfolioPrivacy()

  useEffect(() => { setHydrated(true) }, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['portfolio', 'list', 'preview'],
    queryFn: () => fetchPortfolioList({ status: 'active' }, { page: 1, pageSize: 5 }),
  })

  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

  const rawHoldings: HoldingItemVM[] = data?.items
    ? data.items.map(item => transformHoldingItem(item, locale))
    : []

  const apiItems = data?.items ?? []
  const groupedHoldings: GroupedHoldingItem[] = []
  rawHoldings.forEach((item, idx) => {
    const apiItem = apiItems[idx]
    const last = groupedHoldings[groupedHoldings.length - 1]
    const isSameGroup = last &&
      last.brand === item.brand &&
      last.weight === item.weight &&
      last.avgBuyPrice === item.avgBuyPrice &&
      last.buyDate === item.buyDate

    if (isSameGroup) {
      last.count += 1
      last._rawTotalBuyValue += apiItem?.totalBuyValue ?? 0
      last._rawTotalValue = last._rawTotalValue !== null && apiItem?.currentValue != null
        ? last._rawTotalValue + apiItem.currentValue
        : last._rawTotalValue
      last._rawPnl = last._rawPnl !== null && apiItem?.unrealizedPnL != null
        ? last._rawPnl + apiItem.unrealizedPnL
        : last._rawPnl
      // Re-format aggregated display strings
      last.totalBuyValue = fmtCurrency(last._rawTotalBuyValue)
      last.totalValue = last._rawTotalValue != null ? fmtCurrency(last._rawTotalValue) : '-'
      last.pnl = last._rawPnl != null ? fmtCurrency(Math.abs(last._rawPnl)) : '-'
      const pnlPct = last._rawTotalBuyValue > 0 && last._rawPnl != null
        ? (last._rawPnl / last._rawTotalBuyValue) * 100
        : null
      const sign = pnlPct != null && pnlPct > 0 ? '+' : ''
      last.pnlPercentage = pnlPct != null ? `${sign}${pnlPct.toFixed(2)}%` : last.pnlPercentage
      last.pnlColor = last._rawPnl != null
        ? (last._rawPnl > 0 ? 'positive' : last._rawPnl < 0 ? 'negative' : 'neutral')
        : 'neutral'
    } else {
      groupedHoldings.push({
        ...item,
        count: 1,
        _rawTotalBuyValue: apiItem?.totalBuyValue ?? 0,
        _rawTotalValue: apiItem?.currentValue ?? null,
        _rawPnl: apiItem?.unrealizedPnL ?? null,
      })
    }
  })

  if (isLoading) {
    return <HoldingsPreviewSkeleton />
  }

  if (error) {
    return (
      <Stack gap="md" role="alert">
        <SectionHeader title={t('dashboard.recentHoldings')} />
        <Stack direction="horizontal" gap="xs" className="items-center rounded-xl border border-dashed border-border bg-surface/50 p-4">
          <AlertCircle className="h-4 w-4 text-negative/60 shrink-0" aria-hidden="true" />
          <Typography variant="body-sm" className="text-muted-foreground flex-1">
            {t('common.error')}
          </Typography>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
          >
            {t('common.retry')}
          </button>
        </Stack>
      </Stack>
    )
  }

  if (groupedHoldings.length === 0) {
    return <HoldingsPreviewEmpty />
  }

  return (
    <Stack gap="md">
      <SectionHeader
        title={t('dashboard.recentHoldings')}
        actionLabel={t('common.viewAll')}
        href={ROUTES.HOLDINGS_LIST}
      />
      <Stack gap="none">
        {groupedHoldings.map((holding, index) => {
          const hasValuation = holding.totalValue !== '-'
          const isPositive = holding.pnlColor === 'positive'
          const isNegative = holding.pnlColor === 'negative'
          const label = `${holding.brandName} · ${holding.weight}${holding.count > 1 ? ` (x${holding.count})` : ''}`
          const subtitle = `${t('dashboard.purchasedOn')} ${holding.buyDate} · ${hydrated && isVisible ? holding.totalBuyValue : '••••••'}`

          return (
            <ListRow
              key={`${holding.id}-${index}`}
              leading={
                <div className="w-8 h-8 rounded-full bg-accent-gold/15 flex items-center justify-center">
                  <Typography variant="caption" className="font-bold text-accent-gold uppercase text-xs">
                    {holding.brandName.charAt(0)}
                  </Typography>
                </div>
              }
              title={label}
              subtitle={subtitle}
              trailing={
                hasValuation ? (
                  <Typography variant="body-sm" className="font-medium text-foreground">
                    {hydrated && isVisible ? holding.totalValue : '••••••'}
                  </Typography>
                ) : undefined
              }
              trailingSubtitle={
                hasValuation ? (
                  <Typography
                    variant="caption"
                    className={cn(
                      'font-medium',
                      isPositive && 'text-positive',
                      isNegative && 'text-negative',
                      !isPositive && !isNegative && 'text-muted-foreground'
                    )}
                  >
                    {hydrated && isVisible ? `${holding.pnl} (${holding.pnlPercentage})` : '••••••'}
                  </Typography>
                ) : (
                  <Typography variant="caption" className="text-muted-foreground italic">
                    {t('dashboard.valuationUnavailable')}
                  </Typography>
                )
              }
              showDivider={index < groupedHoldings.length - 1}
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

function HoldingsPreviewEmpty() {
  const { t } = useLanguage()

  return (
    <Stack gap="md">
      <SectionHeader title={t('dashboard.recentHoldings')} />
      <Stack gap="md" className="rounded-xl border border-dashed border-border bg-surface/50 p-6 items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
          <Coins className="w-5 h-5 text-muted-foreground" />
        </div>
        <Stack gap="xs" className="items-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            {t('dashboard.noHoldingsYet')}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground/70 max-w-xs">
            {t('dashboard.addFirstHoldingPrompt')}
          </Typography>
        </Stack>
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={ROUTES.ADD_HOLDING}>
            <Plus className="w-4 h-4" />
            <span>{t('dashboard.addFirstHolding')}</span>
          </Link>
        </Button>
      </Stack>
    </Stack>
  )
}

function HoldingsPreviewSkeleton() {
  return (
    <Stack gap="md">
      <Stack direction="horizontal" gap="md" className="items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-20" />
      </Stack>
      <Stack gap="none">
        {[1, 2, 3].map((i) => (
          <Stack key={i} direction="horizontal" gap="sm" className={`py-3 items-center ${i < 3 ? 'border-b border-border' : ''}`}>
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Stack gap="xs" className="flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </Stack>
            <Stack gap="xs" className="items-end shrink-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
