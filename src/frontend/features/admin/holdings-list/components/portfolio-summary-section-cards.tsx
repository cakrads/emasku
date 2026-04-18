'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { Stack, Section } from '@/frontend/components/ui/layout'
import { TrendingUp, Scale, Wallet, Info, Coins } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'
import { ResponsiveInfoTip } from '@/frontend/components/ui/responsive-info-tip'

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

export default function PortfolioSummarySectionCards({
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
  const { isVisible } = usePortfolioPrivacy()
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
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {skeletonItems.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-3 space-y-2">
            <Stack direction="horizontal" gap="xs" className="items-center opacity-60">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Skeleton className="h-3 w-20 rounded" />
            </Stack>
            <Skeleton className="h-6 w-24 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      icon: <Scale className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.totalWeight'),
      value: isVisible ? formatWeight(totalWeightGram) : '••••••',
      sub: null,
      color: '',
      show: true,
      info: null,
    },
    {
      icon: <Wallet className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.purchaseValue'),
      value: isVisible ? formatCurrency(totalBuyValue) : '••••••••',
      sub: null,
      color: '',
      show: true,
      info: null,
    },
    {
      icon: <Coins className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
      label: t('holdings.summary.estimatedValue'),
      value: isVisible ? formatCurrency(totalCurrentValue) : '••••••••',
      sub: null,
      color: 'text-accent-gold',
      show: showValuation,
      info: t('holdings.summary.estimatedValueTooltip'),
    },
    {
      icon: <TrendingUp className={cn('w-3.5 h-3.5 shrink-0', totalPnL > 0 ? 'text-positive' : totalPnL < 0 ? 'text-negative rotate-180' : 'text-muted-foreground')} />,
      label: t('holdings.summary.profitLoss'),
      value: isVisible ? `${totalPnL > 0 ? '+' : ''}${formatCurrency(totalPnL)}` : '••••••••',
      sub: isVisible ? `(${pnlPercentage > 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%)` : '(•••%)',
      color: pnlColor,
      show: showValuation,
      info: t('holdings.summary.profitLossTooltip'),
    },
  ].filter(m => m.show)

  return (
    <>
      {/* Mobile: horizontal scroll cards */}
      <div className="md:hidden space-y-2">
        <Typography variant="caption" className="text-muted-foreground text-xs font-semibold uppercase tracking-wide px-1 mb-2">
          Ringkasan
        </Typography>
        <div className="overflow-x-auto flex gap-3 pb-1 scrollbar-hide">
          {metrics.map((m, i) => (
            <div key={i} className="shrink-0 min-w-32 rounded-xl border border-teal-100 dark:border-teal-900/50 bg-teal-50/60 dark:bg-teal-950/20 p-3 pr-16 space-y-1.5">
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
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: original Section with grid */}
      <Section className="hidden md:block bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl border border-teal-100 dark:border-teal-900/50 min-h-[145px] p-6 md:p-8">
        <Typography variant="caption" className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-4 block">
          Ringkasan
        </Typography>
        <div className={cn('grid gap-6', showValuation ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2')}>
          {/* Total Weight */}
          <div className="space-y-1 min-w-0">
            <Stack direction="horizontal" gap="xs" className="items-center">
              <Scale className="w-4 h-4 text-muted-foreground shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-xs">
                {t('holdings.summary.totalWeight')}
              </Typography>
            </Stack>
            <ResponsiveInfoTip content={<p className="font-mono">{formatWeight(totalWeightGram)}</p>}>
              <Typography as="div" className="text-2xl font-bold truncate cursor-help">
                {isVisible ? formatWeight(totalWeightGram) : '••••••'}
              </Typography>
            </ResponsiveInfoTip>
          </div>

          <div className="space-y-1 min-w-0">
            <Stack direction="horizontal" gap="xs" className="items-center">
              <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-xs">
                {t('holdings.summary.purchaseValue')}
              </Typography>
            </Stack>
            <ResponsiveInfoTip content={<p className="font-mono">{formatCurrency(totalBuyValue)}</p>}>
              <Typography as="div" className="text-2xl font-bold financial-value truncate cursor-help">
                {isVisible ? formatCurrency(totalBuyValue) : '••••••••'}
              </Typography>
            </ResponsiveInfoTip>
          </div>

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
                <Typography as="div" className="text-2xl font-bold financial-value text-accent-gold truncate cursor-help">
                  {isVisible ? formatCurrency(totalCurrentValue) : '••••••••'}
                </Typography>
              </ResponsiveInfoTip>
            </div>
          )}

          {showValuation && (
            <div className="space-y-1 min-w-0">
              <ResponsiveInfoTip content={
                <>
                  <p>{t('holdings.summary.profitLossTooltip')}</p>
                  <p className="font-mono mt-1 opacity-70">= {t('holdings.summary.estimatedValue')} - {t('holdings.summary.purchaseValue')}</p>
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
              <div className={cn('flex flex-col xl:flex-row xl:items-baseline gap-x-2', pnlColor)}>
                <ResponsiveInfoTip content={<p className="font-mono">{totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}</p>}>
                  <Typography as="div" className="text-2xl font-bold truncate cursor-help">
                    {isVisible ? <>{totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}</> : '••••••••'}
                  </Typography>
                </ResponsiveInfoTip>
                <Typography variant="caption" className="text-xs shrink-0">
                  {isVisible ? `(${pnlPercentage > 0 ? '+' : ''}${pnlPercentage.toFixed(2)}%)` : '(•••%)'}
                </Typography>
              </div>
            </div>
          )}
        </div>

        {(showValuation || isFiltered) && (
          <div className="mt-4 -mx-8 -mb-8 px-8 py-3 bg-muted/30 dark:bg-muted/10 rounded-b-xl border-t border-border/30 flex flex-wrap items-start justify-start gap-x-3 gap-y-1">
            {showValuation && (
              <div className="flex items-start gap-1.5 max-w-full">
                <Info className="w-3 h-3 mt-0.5 text-muted-foreground/60 shrink-0" />
                <Typography variant="caption" className="text-muted-foreground text-2xs text-left">
                  {t('holdings.summary.disclosure')}
                </Typography>
              </div>
            )}
            {isFiltered && showValuation && (
              <span className="text-muted-foreground/40 text-2xs mt-0.5">•</span>
            )}
            {isFiltered && (
              <Typography variant="caption" className="text-accent-gold text-2xs mt-0.5">
                {t('holdings.filteredData')}
              </Typography>
            )}
          </div>
        )}
      </Section>

      {/* Mobile footer */}
      {(showValuation || isFiltered) && (
        <div className="md:hidden flex flex-wrap items-start gap-x-3 gap-y-1 px-1">
          {showValuation && (
            <div className="flex items-start gap-1.5">
              <Info className="w-3 h-3 mt-0.5 text-muted-foreground/60 shrink-0" />
              <Typography variant="caption" className="text-muted-foreground text-2xs text-left">
                {t('holdings.summary.disclosure')}
              </Typography>
            </div>
          )}
          {isFiltered && (
            <Typography variant="caption" className="text-accent-gold text-2xs mt-0.5">
              {t('holdings.filteredData')}
            </Typography>
          )}
        </div>
      )}
    </>
  )
}
