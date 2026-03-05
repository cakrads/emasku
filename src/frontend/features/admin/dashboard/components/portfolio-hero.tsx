'use client'

import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { Info, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'
import { PrivacyToggle } from '@/frontend/components/ui/privacy-toggle'

interface PnLPeriod {
  key: string
  label: string
  value: string | null
  percentage: string | null
  color: 'positive' | 'negative' | 'neutral'
  alwaysShow?: boolean // For "Today" card
}

interface PortfolioHeroProps {
  totalValue: string
  totalPnL: string               // All time IDR
  gainLossPercentage: string      // All time %
  todayChange?: string | null
  todayChangePercentage?: string | null
  weeklyChange?: string | null
  weeklyChangePercentage?: string | null
  monthlyChange?: string | null
  monthlyChangePercentage?: string | null
  yearlyChange?: string | null
  yearlyChangePercentage?: string | null
  disclaimer?: string
  excludedCount?: number
  pnlColor?: 'positive' | 'negative' | 'neutral'
  todayColor?: 'positive' | 'negative' | 'neutral'
  weeklyColor?: 'positive' | 'negative' | 'neutral'
  monthlyColor?: 'positive' | 'negative' | 'neutral'
  yearlyColor?: 'positive' | 'negative' | 'neutral'
}

export default function PortfolioHero({
  totalValue,
  totalPnL,
  gainLossPercentage,
  todayChange,
  todayChangePercentage,
  weeklyChange,
  weeklyChangePercentage,
  monthlyChange,
  monthlyChangePercentage,
  yearlyChange,
  yearlyChangePercentage,
  excludedCount,
  pnlColor = 'neutral',
  todayColor = 'neutral',
  weeklyColor = 'neutral',
  monthlyColor = 'neutral',
  yearlyColor = 'neutral',
}: PortfolioHeroProps) {
  const { t } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()
  const isGainPositive = pnlColor === 'positive'

  // Build array of all periods
  const allPeriods: PnLPeriod[] = [
    { key: 'today', label: t('dashboard.today'), value: todayChange ?? null, percentage: todayChangePercentage ?? null, color: todayColor, alwaysShow: true },
    { key: 'weekly', label: t('dashboard.weekly'), value: weeklyChange ?? null, percentage: weeklyChangePercentage ?? null, color: weeklyColor },
    { key: 'monthly', label: t('dashboard.monthly'), value: monthlyChange ?? null, percentage: monthlyChangePercentage ?? null, color: monthlyColor },
    { key: 'yearly', label: t('dashboard.yearly'), value: yearlyChange ?? null, percentage: yearlyChangePercentage ?? null, color: yearlyColor },
  ]

  // Filter periods: Always show "Today", "Weekly", "Monthly", "Yearly"
  // We only filter out periods that are actually null/missing
  const visiblePeriods = allPeriods.filter(p => p.alwaysShow || p.value !== null)

  const getColorClass = (color: 'positive' | 'negative' | 'neutral') => {
    if (color === 'positive') return 'text-positive'
    if (color === 'negative') return 'text-negative'
    return 'text-foreground'
  }

  // Shared trigger content
  const ExcludedInfoTrigger = (
    <Stack direction="horizontal" gap="xs" className="text-muted-foreground/60 cursor-pointer w-fit hover:text-muted-foreground transition-colors items-center">
      <Info className="w-3 h-3" />
      <Typography variant="caption">
        {excludedCount} {t('dashboard.excludedHoldings')}
      </Typography>
    </Stack>
  )

  return (
    <Stack gap="none" className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50">
      {/* Header */}
      <Stack gap="md" className="mb-6">
        <Stack gap="xs" className="mb-2">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider font-semibold">
              {t('dashboard.portfolioValue')}
            </Typography>
            <PrivacyToggle className="h-4 w-4 text-muted-foreground/70" iconClassName="h-3 w-3" />
          </Stack>

          <Typography className="text-4xl md:text-5xl font-bold text-foreground financial-value tracking-tight">
            {isVisible ? (totalValue || '—') : '••••••••'}
          </Typography>
        </Stack>

        {/* PnL Row */}
        {pnlColor !== 'neutral' && (
          <Stack direction="horizontal" gap="sm" className="items-center mb-1">
            <Stack direction="horizontal" gap="xs" className={cn("items-center font-semibold", isGainPositive ? "text-positive" : "text-negative")}>
              <TrendingUp className="w-4 h-4" />
              <span>{isVisible ? gainLossPercentage : '•••%'}</span>
            </Stack>
            <Divider direction="vertical" className="h-4" />
            <Typography variant="body" className="text-muted-foreground font-medium">
              {isVisible ? (
                <>
                  {isGainPositive ? 'Profit' : 'Loss'} {totalPnL}
                </>
              ) : (
                '••••••••'
              )}
            </Typography>
          </Stack>
        )}

        <Typography variant="caption" className="text-muted-foreground text-xs">
          {t('dashboard.estimationContext')}
        </Typography>
      </Stack>

      {/* Periodic Metrics - Horizontal scroll on mobile, grid on desktop */}
      {totalValue && (
        <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide">
          {visiblePeriods.map((period) => (
            <Stack
              key={period.key}
              className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-3 md:p-4 border border-teal-100 dark:border-teal-900 backdrop-blur-sm min-w-[120px] md:min-w-0 shrink-0 md:shrink"
            >
              <Typography variant="caption" className="text-muted-foreground uppercase text-xs font-semibold mb-1 block">
                {period.label}
              </Typography>
              <Stack gap="xs">
                <Typography
                  variant="body-sm"
                  className={cn("font-bold whitespace-nowrap", getColorClass(period.color))}
                >
                  {isVisible ? (period.value ?? '—') : '••••••'}
                </Typography>
                {period.percentage && period.percentage !== '-' && (
                  <Typography variant="caption" className={cn("text-xs", getColorClass(period.color))}>
                    {isVisible ? `(${period.percentage})` : '(•••%)'}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))}
        </div>
      )}

      {/* Excluded holdings info */}
      {(excludedCount ?? 0) > 0 && (
        <Stack className="mt-4">
          {/* Desktop: Tooltip (hover) */}
          <Stack className="hidden md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                {ExcludedInfoTrigger}
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" sideOffset={8}>
                <Typography variant="caption">{t('dashboard.excludedHoldingsTooltip')}</Typography>
              </TooltipContent>
            </Tooltip>
          </Stack>

          {/* Mobile: Popover (click) */}
          <Stack className="flex md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-muted-foreground/60 cursor-pointer w-fit hover:text-muted-foreground transition-colors">
                  <Info className="w-3 h-3" />
                  <Typography variant="caption">
                    {excludedCount} {t('dashboard.excludedHoldings')}
                  </Typography>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 mx-4" sideOffset={8} collisionPadding={16}>
                <Typography variant="body-sm" className="text-muted-foreground">{t('dashboard.excludedHoldingsTooltip')}</Typography>
              </PopoverContent>
            </Popover>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
