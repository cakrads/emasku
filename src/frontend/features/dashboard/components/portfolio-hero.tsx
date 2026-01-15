'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { Info } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

interface PortfolioHeroProps {
  totalValue: string
  gainLossPercentage: string
  todayChange: string
  todayChangePercentage: string
  disclaimer?: string
  excludedCount?: number
  pnlColor?: 'positive' | 'negative' | 'neutral'
  todayColor?: 'positive' | 'negative' | 'neutral'
}

export default function PortfolioHero({
  totalValue,
  gainLossPercentage,
  todayChangePercentage,
  excludedCount,
  pnlColor = 'neutral',
  todayColor = 'neutral',
}: PortfolioHeroProps) {
  const { t } = useLanguage()
  const isGainPositive = pnlColor === 'positive'
  const isGainNeutral = pnlColor === 'neutral'

  const isTodayPositive = todayColor === 'positive'
  const isTodayNeutral = todayColor === 'neutral'

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
          <Stack direction="horizontal" gap="sm" className="items-center flex-wrap">
            <Typography variant="body-sm" className="text-(--text-muted)">
              {t('dashboard.allTime')}:
            </Typography>
            <Typography
              variant="body-sm"
              className={isGainPositive ? 'text-(--positive) font-medium' : isGainNeutral ? 'font-medium' : 'text-(--negative) font-medium'}
            >
              {gainLossPercentage}
            </Typography>

            {todayChangePercentage !== '—' && (
              <>
                <Typography variant="body-sm" className="text-(--text-muted)">•</Typography>
                <Typography variant="body-sm" className="text-(--text-muted)">
                  {t('dashboard.today')}:
                </Typography>
                <Typography
                  variant="body-sm"
                  className={isTodayPositive ? 'text-(--positive) font-medium' : isTodayNeutral ? 'font-medium' : 'text-(--negative) font-medium'}
                >
                  {todayChangePercentage}
                </Typography>
              </>
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
