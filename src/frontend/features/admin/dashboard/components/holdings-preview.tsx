'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { SectionHeader } from '@/frontend/components/ui/section-header'
import { ListRow } from '@/frontend/components/ui/list-row'
import { Button } from '@/frontend/components/ui/button'
import { Plus, Coins } from 'lucide-react'
import { fetchPortfolioList } from '@/frontend/services/portfolio/portfolio.api'
import { transformHoldingItem, HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { ROUTES } from '@/frontend/config/routes'
import { cn } from '@/frontend/utils/cn'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

interface GroupedHoldingItem extends HoldingItemVM {
  count: number
}

export default function HoldingsPreview() {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'
  const { isVisible } = usePortfolioPrivacy()

  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio', 'list', 'preview'],
    queryFn: () => fetchPortfolioList({ status: 'active' }, { page: 1, pageSize: 5 }),
  })

  const rawHoldings: HoldingItemVM[] = data?.items
    ? data.items.map(item => transformHoldingItem(item, locale))
    : []

  const groupedHoldings: GroupedHoldingItem[] = []
  rawHoldings.forEach((item) => {
    const last = groupedHoldings[groupedHoldings.length - 1]
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

  if (isLoading) {
    return <HoldingsPreviewSkeleton />
  }

  if (error) {
    return null
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
          const subtitle = `${t('dashboard.purchasedOn')} ${holding.buyDate} · ${isVisible ? holding.totalBuyValue : '••••••'}`

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
                    {isVisible ? holding.totalValue : '••••••'}
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
                    {isVisible ? `${holding.pnl} (${holding.pnlPercentage})` : '••••••'}
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
