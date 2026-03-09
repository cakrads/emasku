'use client'

import { useState, useEffect } from 'react'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { Info } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'
import { cn } from '@/frontend/utils/cn'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

export const PERIOD_KEYS = ['today', 'weekly', 'monthly', 'yearly'] as const
type PeriodKey = typeof PERIOD_KEYS[number]

interface PeriodData {
  key: PeriodKey
  label: string
  value: string | null
  percentage: string | null
  color: 'positive' | 'negative' | 'neutral'
}

interface PortfolioHeroProps {
  totalValue: string
  todayChange?: string | null
  todayChangePercentage?: string | null
  weeklyChange?: string | null
  weeklyChangePercentage?: string | null
  monthlyChange?: string | null
  monthlyChangePercentage?: string | null
  yearlyChange?: string | null
  yearlyChangePercentage?: string | null
  excludedCount?: number
  todayColor?: 'positive' | 'negative' | 'neutral'
  weeklyColor?: 'positive' | 'negative' | 'neutral'
  monthlyColor?: 'positive' | 'negative' | 'neutral'
  yearlyColor?: 'positive' | 'negative' | 'neutral'
}

export default function PortfolioHero({
  totalValue,
  todayChange,
  todayChangePercentage,
  weeklyChange,
  weeklyChangePercentage,
  monthlyChange,
  monthlyChangePercentage,
  yearlyChange,
  yearlyChangePercentage,
  excludedCount,
  todayColor = 'neutral',
  weeklyColor = 'neutral',
  monthlyColor = 'neutral',
  yearlyColor = 'neutral',
}: PortfolioHeroProps) {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('today')
  const [hydrated, setHydrated] = useState(false)
  const { t } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()

  useEffect(() => { setHydrated(true) }, [])

  const periods: PeriodData[] = [
    { key: 'today', label: t('dashboard.today'), value: todayChange ?? null, percentage: todayChangePercentage ?? null, color: todayColor },
    { key: 'weekly', label: t('dashboard.weekly'), value: weeklyChange ?? null, percentage: weeklyChangePercentage ?? null, color: weeklyColor },
    { key: 'monthly', label: t('dashboard.monthly'), value: monthlyChange ?? null, percentage: monthlyChangePercentage ?? null, color: monthlyColor },
    { key: 'yearly', label: t('dashboard.yearly'), value: yearlyChange ?? null, percentage: yearlyChangePercentage ?? null, color: yearlyColor },
  ]

  const activePeriodData = periods.find(p => p.key === activePeriod) ?? periods[0]

  const getColorClass = (color: 'positive' | 'negative' | 'neutral') => {
    if (color === 'positive') return 'text-positive'
    if (color === 'negative') return 'text-negative'
    return 'text-muted-foreground'
  }

  const ExcludedInfoContent = (
    <>
      <Info className="w-3 h-3" aria-hidden="true" />
      <Typography variant="caption">
        {excludedCount} {t('dashboard.excludedHoldings')}
      </Typography>
    </>
  )

  return (
    <Stack gap="sm">
      {/* Total Value - Hero */}
      <Typography className="text-4xl md:text-5xl font-bold text-foreground financial-value tracking-tight">
        {hydrated && isVisible ? (totalValue || '—') : (
          <>
            <span aria-hidden="true">••••••••</span>
            <span className="sr-only">{t('dashboard.hiddenPortfolioValue')}</span>
          </>
        )}
      </Typography>

      {/* Period PnL */}
      {activePeriodData.value ? (
        <Typography variant="body-sm" className={cn('font-medium', getColorClass(activePeriodData.color))}>
          {hydrated && isVisible
            ? `${activePeriodData.value}${activePeriodData.percentage ? ` (${activePeriodData.percentage})` : ''}`
            : (
              <>
                <span aria-hidden="true">•••••••• (•••%)</span>
                <span className="sr-only">{t('dashboard.hiddenPeriodChange')}</span>
              </>
            )
          }
        </Typography>
      ) : (
        <Typography variant="body-sm" className="text-muted-foreground">—</Typography>
      )}

      {/* Period Tabs */}
      <Stack direction="horizontal" gap="none" className="items-center gap-x-4">
        {periods.map((period) => (
          <button
            key={period.key}
            type="button"
            onClick={() => setActivePeriod(period.key)}
            aria-pressed={activePeriod === period.key}
            className={cn(
              'text-xs font-medium pb-0.5 transition-colors border-b-2',
              activePeriod === period.key
                ? 'text-foreground border-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            )}
          >
            {period.label}
          </button>
        ))}
      </Stack>

      {/* Estimation disclaimer */}
      <Typography variant="caption" className="text-muted-foreground/70">
        {t('dashboard.estimationContext')}
      </Typography>

      {/* Excluded holdings info */}
      {(excludedCount ?? 0) > 0 && (
        <Stack className="mt-1">
          {/* Desktop: Tooltip */}
          <Stack className="hidden md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="flex items-center gap-1.5 text-muted-foreground/60 cursor-pointer w-fit hover:text-muted-foreground transition-colors">
                  {ExcludedInfoContent}
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" sideOffset={8}>
                <Typography variant="caption">{t('dashboard.excludedHoldingsTooltip')}</Typography>
              </TooltipContent>
            </Tooltip>
          </Stack>

          {/* Mobile: Popover */}
          <Stack className="flex md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex items-center gap-1.5 text-muted-foreground/60 cursor-pointer w-fit hover:text-muted-foreground transition-colors">
                  {ExcludedInfoContent}
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
