'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { Info } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

interface PnLPeriod {
  label: string
  value: string | null
  percentage: string | null
  color: 'positive' | 'negative' | 'neutral'
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
  const isGainPositive = pnlColor === 'positive'
  const isGainNeutral = pnlColor === 'neutral'

  // Build array of available periods
  const periods: PnLPeriod[] = [
    { label: t('dashboard.today'), value: todayChange ?? null, percentage: todayChangePercentage ?? null, color: todayColor },
    { label: t('dashboard.weekly'), value: weeklyChange ?? null, percentage: weeklyChangePercentage ?? null, color: weeklyColor },
    { label: t('dashboard.monthly'), value: monthlyChange ?? null, percentage: monthlyChangePercentage ?? null, color: monthlyColor },
    { label: t('dashboard.yearly'), value: yearlyChange ?? null, percentage: yearlyChangePercentage ?? null, color: yearlyColor },
  ].filter(p => p.value !== null)

  const getColorClass = (color: 'positive' | 'negative' | 'neutral') => {
    if (color === 'positive') return 'text-positive font-medium'
    if (color === 'negative') return 'text-negative font-medium'
    return 'font-medium'
  }

  // Shared trigger content
  const ExcludedInfoTrigger = (
    <div className="flex items-center gap-1.5 text-muted-foreground/60 cursor-pointer w-fit hover:text-muted-foreground transition-colors">
      <Info className="w-3 h-3" />
      <Typography variant="caption">
        {excludedCount} {t('dashboard.excludedHoldings')}
      </Typography>
    </div>
  )

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Typography variant="h4" className='mb-2'>{t('dashboard.portfolioValue')}</Typography>
        <Typography as="h1" className="text-5xl md:text-5xl font-bold financial-value mb-2">
          {totalValue || '—'}
        </Typography>
        {totalValue && (
          <Typography variant="caption" className="text-(--text-muted)">
            {t('dashboard.estimationContext')}
          </Typography>
        )}

        {!totalValue && (
          <Typography variant="body-sm">{t('dashboard.unableToCalculate')}</Typography>
        )}
      </Stack>

      <Stack gap="sm">
        {totalValue && (
          <Stack gap="xs">
            {/* All Time Section */}
            <Stack direction="horizontal" gap="sm" className="items-center flex-wrap">
              <Typography variant="body-sm" className="text-(--text-muted)">
                {t('dashboard.allTime')}:
              </Typography>
              <Typography
                variant="body-sm"
                className={isGainPositive ? 'text-positive font-medium' : isGainNeutral ? 'font-medium' : 'text-negative font-medium'}
              >
                {totalPnL} ({gainLossPercentage})
              </Typography>
            </Stack>

            {/* Periodic PnL Section (Next Line) */}
            {periods.length > 0 && (
              <Stack direction="horizontal" gap="sm" className="items-center flex-wrap">
                {periods.map((period, index) => (
                  <span key={period.label} className="flex items-center gap-1">
                    {index > 0 && <Typography variant="body-sm" className="text-(--text-muted) mr-2">•</Typography>}
                    <Typography variant="body-sm" className="text-(--text-muted)">
                      {period.label}:
                    </Typography>
                    <Typography variant="body-sm" className={getColorClass(period.color)}>
                      {period.value} {period.percentage && period.percentage !== '-' ? `(${period.percentage})` : ''}
                    </Typography>
                  </span>
                ))}
              </Stack>
            )}
          </Stack>
        )}

        {(excludedCount ?? 0) > 0 && (
          <>
            {/* Desktop: Tooltip (hover) */}
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  {ExcludedInfoTrigger}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" sideOffset={8}>
                  <p>{t('dashboard.excludedHoldingsTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Mobile: Popover (click) */}
            <div className="block md:hidden">
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
                  <p className="text-sm text-muted-foreground">{t('dashboard.excludedHoldingsTooltip')}</p>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </Stack>
    </Stack>
  )
}

