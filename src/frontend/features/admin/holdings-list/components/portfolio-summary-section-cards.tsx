'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { TrendingUp, Scale, Wallet, Info, Coins } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'
import { ResponsiveInfoTip } from '@/frontend/components/ui/responsive-info-tip'
import { formatCurrency, formatWeight } from '@/frontend/utils/format'

interface PortfolioSummarySectionCardsProps {
  totalWeightGram: number
  totalBuyValue: number
  totalCurrentValue: number
  totalPnL: number
  pnlPercentage: number
  isFiltered?: boolean
  isLoading?: boolean
  statusFilter?: 'active' | 'sold' | 'all'
}

export default function PortfolioSummarySectionCards({
  totalWeightGram,
  totalBuyValue,
  totalCurrentValue,
  totalPnL,
  pnlPercentage,
  isFiltered = false,
  isLoading = false,
  statusFilter = 'active',
}: PortfolioSummarySectionCardsProps) {
  const { t, language } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  const pnlColor = totalPnL > 0 ? 'text-positive' : totalPnL < 0 ? 'text-negative' : 'text-muted-foreground'
  const showValuation = statusFilter !== 'sold'

  if (isLoading) {
    const skeletonItems = [
      { icon: Scale, label: t('holdings.summary.totalWeight') },
      { icon: Wallet, label: t('holdings.summary.purchaseValue') },
      { icon: Coins, label: t('holdings.summary.estimatedValue') },
      { icon: TrendingUp, label: t('holdings.summary.profitLoss') },
    ]

    return (
      <Stack className="grid grid-cols-2 gap-3 md:hidden">
        {skeletonItems.map((item, i) => (
          <Stack key={i} className="rounded-xl border border-border bg-surface p-3 space-y-2">
            <Stack direction="horizontal" gap="xs" className="items-center opacity-60">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Skeleton className="h-3 w-20 rounded" />
            </Stack>
            <Skeleton className="h-6 w-24 rounded" />
          </Stack>
        ))}
      </Stack>
    )
  }

  const metrics = [
    {
      icon: <Scale className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.totalWeight'),
      value: isVisible ? formatWeight(totalWeightGram, locale) : '••••••',
      sub: null,
      color: '',
      show: true,
      info: null,
    },
    {
      icon: <Wallet className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.purchaseValue'),
      value: isVisible ? formatCurrency(totalBuyValue, locale) : '••••••••',
      sub: null,
      color: '',
      show: true,
      info: null,
    },
    {
      icon: <Coins className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.estimatedValue'),
      value: isVisible ? formatCurrency(totalCurrentValue, locale) : '••••••••',
      sub: null,
      color: 'text-accent-gold',
      show: showValuation,
      info: t('holdings.summary.estimatedValueTooltip'),
    },
    {
      icon: <TrendingUp className={cn('w-3.5 h-3.5 shrink-0', totalPnL > 0 ? 'text-positive' : totalPnL < 0 ? 'text-negative rotate-180' : 'text-muted-foreground')} />,
      label: t('holdings.summary.profitLoss'),
      value: isVisible ? `${totalPnL > 0 ? '+' : ''}${formatCurrency(totalPnL, locale)}` : '••••••••',
      sub: isVisible ? `(${pnlPercentage > 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%)` : '(•••%)',
      color: pnlColor,
      show: showValuation,
      info: t('holdings.summary.profitLossTooltip'),
    },
  ].filter(m => m.show)

  return (
    <>
      {/* Mobile: horizontal scroll cards */}
      <Stack className="md:hidden space-y-2">
        <Typography variant="caption" className="text-muted-foreground text-xs font-semibold uppercase tracking-wide px-1 mb-2">
          {t('holdings.summary.title')}
        </Typography>
        <Stack className="overflow-x-auto flex gap-3 pb-1 scrollbar-hide">
          {metrics.map((m, i) => (
            <Stack key={i} className="shrink-0 min-w-32 rounded-xl border border-border bg-surface p-3 pr-16 space-y-1.5">
              <Stack direction="horizontal" gap="xs" className="items-center">
                {m.icon}
                <Typography variant="caption" className="text-muted-foreground text-2xs whitespace-nowrap">
                  {m.label}
                </Typography>
                {m.info && <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />}
              </Stack>
              <Typography as="div" className={cn('text-base font-bold financial-value leading-tight', m.color)}>
                {m.value}
              </Typography>
              {m.sub && (
                <Typography variant="caption" className={cn('text-2xs', m.color)}>
                  {m.sub}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* Desktop: original Section with grid */}
      <Section className="hidden md:block bg-linear-to-r from-accent-gold/5 to-background rounded-2xl border border-border min-h-36 p-6 md:p-8">
        <Typography variant="caption" className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-4 block">
          {t('holdings.summary.title')}
        </Typography>
        <Stack className={cn('grid gap-6', showValuation ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2')}>
          {/* Total Weight */}
          <Stack className="space-y-1 min-w-0">
            <Stack direction="horizontal" gap="xs" className="items-center">
              <Scale className="w-4 h-4 text-muted-foreground shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-xs">
                {t('holdings.summary.totalWeight')}
              </Typography>
            </Stack>
            <ResponsiveInfoTip content={<Typography className="font-mono">{formatWeight(totalWeightGram, locale)}</Typography>}>
              <Typography as="div" className="text-2xl font-bold truncate cursor-help">
                {isVisible ? formatWeight(totalWeightGram, locale) : '••••••'}
              </Typography>
            </ResponsiveInfoTip>
          </Stack>

          <Stack className="space-y-1 min-w-0">
            <Stack direction="horizontal" gap="xs" className="items-center">
              <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-xs">
                {t('holdings.summary.purchaseValue')}
              </Typography>
            </Stack>
            <ResponsiveInfoTip content={<Typography className="font-mono">{formatCurrency(totalBuyValue, locale)}</Typography>}>
              <Typography as="div" className="text-2xl font-bold financial-value truncate cursor-help">
                {isVisible ? formatCurrency(totalBuyValue, locale) : '••••••••'}
              </Typography>
            </ResponsiveInfoTip>
          </Stack>

          {showValuation && (
            <Stack className="space-y-1 min-w-0">
              <ResponsiveInfoTip content={<Typography>{t('holdings.summary.estimatedValueTooltip')}</Typography>}>
                <Stack direction="horizontal" gap="xs" className="items-center cursor-pointer w-fit">
                  <Coins className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Typography variant="caption" className="text-muted-foreground text-xs">
                    {t('holdings.summary.estimatedValue')}
                  </Typography>
                  <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                </Stack>
              </ResponsiveInfoTip>
              <ResponsiveInfoTip content={<Typography className="font-mono">{formatCurrency(totalCurrentValue, locale)}</Typography>}>
                <Typography as="div" className="text-2xl font-bold financial-value text-accent-gold truncate cursor-help">
                  {isVisible ? formatCurrency(totalCurrentValue, locale) : '••••••••'}
                </Typography>
              </ResponsiveInfoTip>
            </Stack>
          )}

          {showValuation && (
            <Stack className="space-y-1 min-w-0">
              <ResponsiveInfoTip content={
                <>
                  <Typography>{t('holdings.summary.profitLossTooltip')}</Typography>
                  <Typography className="font-mono mt-1 opacity-70">= {t('holdings.summary.estimatedValue')} - {t('holdings.summary.purchaseValue')}</Typography>
                </>
              }>
                <Stack direction="horizontal" gap="xs" className="items-center cursor-pointer w-fit">
                  <TrendingUp className={cn('w-4 h-4 shrink-0', totalPnL > 0 ? 'text-positive' : totalPnL < 0 ? 'text-negative rotate-180' : 'text-muted-foreground')} />
                  <Typography variant="caption" className="text-muted-foreground text-xs">
                    {t('holdings.summary.profitLoss')}
                  </Typography>
                  <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                </Stack>
              </ResponsiveInfoTip>
              <Stack className={cn('flex flex-col xl:flex-row xl:items-baseline gap-x-2', pnlColor)}>
                <ResponsiveInfoTip content={<Typography className="font-mono">{totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL, locale)}</Typography>}>
                  <Typography as="div" className="text-2xl font-bold truncate cursor-help">
                    {isVisible ? <>{totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL, locale)}</> : '••••••••'}
                  </Typography>
                </ResponsiveInfoTip>
                <Typography variant="caption" className="text-xs shrink-0">
                  {isVisible ? `(${pnlPercentage > 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%)` : '(•••%)'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>

        {(showValuation || isFiltered) && (
          <Stack className="mt-4 -mx-8 -mb-8 px-8 py-3 bg-muted/30 dark:bg-muted/10 rounded-b-xl border-t border-border/30 flex flex-wrap items-start justify-start gap-x-3 gap-y-1">
            {showValuation && (
              <Stack direction="horizontal" className="items-start gap-1.5 max-w-full">
                <Info className="w-3 h-3 mt-0.5 text-muted-foreground/60 shrink-0" />
                <Typography variant="caption" className="text-muted-foreground text-2xs text-left">
                  {t('holdings.summary.disclosure')}
                </Typography>
              </Stack>
            )}
            {isFiltered && showValuation && (
              <Typography variant="caption" className="text-muted-foreground/40 text-2xs mt-0.5">•</Typography>
            )}
            {isFiltered && (
              <Typography variant="caption" className="text-accent-gold text-2xs mt-0.5">
                {t('holdings.filteredData')}
              </Typography>
            )}
          </Stack>
        )}
      </Section>

      {/* Mobile footer */}
      {(showValuation || isFiltered) && (
        <Stack className="md:hidden flex flex-wrap items-start gap-x-3 gap-y-1 px-1">
          {showValuation && (
            <Stack direction="horizontal" className="items-start gap-1.5">
              <Info className="w-3 h-3 mt-0.5 text-muted-foreground/60 shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-2xs text-left">
                {t('holdings.summary.disclosure')}
              </Typography>
            </Stack>
          )}
          {isFiltered && (
            <Typography variant="caption" className="text-accent-gold text-2xs mt-0.5">
              {t('holdings.filteredData')}
            </Typography>
          )}
        </Stack>
      )}
    </>
  )
}
