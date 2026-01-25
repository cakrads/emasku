'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { TrendingUp, Scale, Wallet, Info, AlertCircle, Coins } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { useIsMobile } from '@/frontend/hooks/use-mobile'
import { ResponsiveInfoTip } from '@/frontend/components/ui/responsive-info-tip'
import { HoldingCardSkeleton } from './holdings-list-skeleton'

interface PortfolioSummarySectionProps {
  totalWeightGram: number
  totalBuyValue: number
  totalCurrentValue: number
  totalPnL: number
  pnlPercentage: number
  isFiltered?: boolean
  isLoading?: boolean
  statusFilter?: 'active' | 'sold' | 'all'
}

export default function PortfolioSummarySection({
  totalWeightGram,
  totalBuyValue,
  totalCurrentValue,
  totalPnL,
  pnlPercentage,
  isFiltered = false,
  isLoading = false,
  statusFilter = 'active',
}: PortfolioSummarySectionProps) {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatWeight = (grams: number) => {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(grams)} g`
  }

  const pnlColor = totalPnL > 0 ? 'text-(--positive)' : totalPnL < 0 ? 'text-(--negative)' : 'text-muted-foreground'

  // For sold items, don't show estimated value and P/L (already realized)
  const showValuation = statusFilter !== 'sold'

  if (isLoading) {
    const skeletonItems = [
      { icon: Scale, label: t('holdings.summary.totalWeight') },
      { icon: Wallet, label: t('holdings.summary.purchaseValue') },
      { icon: Coins, label: t('holdings.summary.estimatedValue') },
      { icon: TrendingUp, label: t('holdings.summary.profitLoss') },
    ]

    return (
      <Section className="bg-(--surface-elevated) border border-(--border) rounded-xl p-4 md:p-6 min-h-[200px] md:min-h-[132px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {skeletonItems.map((item, i) => (
            <div key={i} className="space-y-1 min-w-0">
              <Stack direction="horizontal" gap="xs" className="items-center opacity-60">
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <Typography variant="caption" className="text-muted-foreground text-xs whitespace-nowrap">
                  {item.label}
                </Typography>
              </Stack>
              {/* Mirroring: flex flex-col xl:flex-row xl:items-baseline gap-x-2 */}
              <div className="flex flex-col xl:flex-row xl:items-baseline gap-x-2 mt-1">
                <Skeleton className="h-7 w-32 md:h-8 md:w-40 rounded-md" />
                {item.label === t('holdings.summary.profitLoss') && (
                  <Skeleton className="h-4 w-12 rounded-md mt-1 xl:mt-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    )
  }

  return (
    <Section className="bg-(--surface-elevated) border border-(--border) rounded-xl p-4 md:p-6 min-h-[200px] md:min-h-[132px]">
      <div className={cn('grid gap-4 md:gap-6', showValuation ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2')}>
        {/* Total Weight */}
        <div className="space-y-1 min-w-0">
          <Stack direction="horizontal" gap="xs" className="items-center">
            <Scale className="w-4 h-4 text-muted-foreground shrink-0" />
            <Typography variant="caption" className="text-muted-foreground text-xs">
              {t('holdings.summary.totalWeight')}
            </Typography>
          </Stack>
          <ResponsiveInfoTip content={<p className="font-mono">{formatWeight(totalWeightGram)}</p>}>
            <Typography as="div" className="text-lg md:text-2xl font-bold truncate cursor-help">
              {formatWeight(totalWeightGram)}
            </Typography>
          </ResponsiveInfoTip>
        </div>

        {/* Total Purchase Value */}
        <div className="space-y-1 min-w-0">
          <Stack direction="horizontal" gap="xs" className="items-center">
            <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
            <Typography variant="caption" className="text-muted-foreground text-xs">
              {t('holdings.summary.purchaseValue')}
            </Typography>
          </Stack>
          <ResponsiveInfoTip content={<p className="font-mono">{formatCurrency(totalBuyValue)}</p>}>
            <Typography as="div" className="text-lg md:text-2xl font-bold financial-value truncate cursor-help">
              {formatCurrency(totalBuyValue)}
            </Typography>
          </ResponsiveInfoTip>
        </div>

        {/* Estimated Sell Value with Popover - hidden for sold items */}
        {showValuation && (
          <div className="space-y-1 min-w-0">
            <ResponsiveInfoTip content={<p>{t('holdings.summary.estimatedValueTooltip')}</p>}>
              <Stack direction="horizontal" gap="xs" className="items-center cursor-pointer w-fit">
                <Coins className="w-4 h-4 text-muted-foreground shrink-0" />
                <Typography variant="caption" className="text-muted-foreground text-xs">
                  {t('holdings.summary.estimatedValue')}
                </Typography>
                <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
              </Stack>
            </ResponsiveInfoTip>
            <ResponsiveInfoTip content={<p className="font-mono">{formatCurrency(totalCurrentValue)}</p>}>
              <Typography as="div" className="text-lg md:text-2xl font-bold financial-value text-accent-gold truncate cursor-help">
                {formatCurrency(totalCurrentValue)}
              </Typography>
            </ResponsiveInfoTip>
          </div>
        )}

        {/* Profit/Loss - hidden for sold items */}
        {showValuation && (
          <div className="space-y-1 min-w-0">
            <ResponsiveInfoTip content={
              <>
                <p>{t('holdings.summary.profitLossTooltip')}</p>
                <p className="font-mono mt-1 opacity-70">= {t('holdings.summary.estimatedValue')} - {t('holdings.summary.purchaseValue')}</p>
              </>
            }>
              <Stack direction="horizontal" gap="xs" className="items-center cursor-pointer w-fit">
                <TrendingUp className={cn(
                  'w-4 h-4 shrink-0',
                  totalPnL > 0 ? 'text-(--positive)' : totalPnL < 0 ? 'text-(--negative) rotate-180' : 'text-muted-foreground'
                )} />
                <Typography variant="caption" className="text-muted-foreground text-xs">
                  {t('holdings.summary.profitLoss')}
                </Typography>
                <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
              </Stack>
            </ResponsiveInfoTip>

            <div className={cn('flex flex-col xl:flex-row xl:items-baseline gap-x-2', pnlColor)}>
              <ResponsiveInfoTip content={<p className="font-mono">{totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}</p>}>
                <Typography as="div" className="text-lg md:text-2xl font-bold truncate cursor-help">
                  {totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}
                </Typography>
              </ResponsiveInfoTip>
              <Typography variant="caption" className="text-xs shrink-0">
                ({pnlPercentage > 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%)
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Footer with disclosure and filter status */}
      {(showValuation || isFiltered) && (
        <div className="mt-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6 px-4 md:px-6 py-2.5 bg-muted/40 rounded-b-xl border-t border-border/30 flex flex-wrap items-start justify-start gap-x-3 gap-y-1">
          {showValuation && (
            <div className="flex items-start gap-1.5 max-w-full">
              <Info className="w-3 h-3 mt-0.5 text-muted-foreground/60 shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-[11px] text-left">
                {t('holdings.summary.disclosure')}
              </Typography>
            </div>
          )}
          {isFiltered && showValuation && (
            <span className="text-muted-foreground/40 text-[10px] mt-0.5">•</span>
          )}
          {isFiltered && (
            <Typography variant="caption" className="text-amber-600 dark:text-amber-400 text-[11px] mt-0.5">
              {t('holdings.filteredData')}
            </Typography>
          )}
        </div>
      )}
    </Section>
  )
}
