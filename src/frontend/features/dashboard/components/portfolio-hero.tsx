'use client'

import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Info } from 'lucide-react'

interface PortfolioHeroProps {
  totalValue: string
  gainLossPercentage: string
  todayChange: string
  todayChangePercentage: string
  disclaimer?: string
  excludedCount?: number
  pnlColor?: 'positive' | 'negative' | 'neutral'
}

export default function PortfolioHero({
  totalValue,
  gainLossPercentage,
  todayChange,
  todayChangePercentage,
  disclaimer,
  excludedCount,
  pnlColor = 'neutral',
}: PortfolioHeroProps) {
  const isGainPositive = pnlColor === 'positive'
  const isGainNeutral = pnlColor === 'neutral'

  // Simplified logic for today change color (could be passed as prop too)
  const isTodayPositive = todayChange.startsWith('+') || (!todayChange.startsWith('-') && todayChange !== '0' && todayChange !== '—')

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Typography variant="h4" className='mb-2'>Portfolio Value</Typography>
        <Typography as="h1" className="text-5xl md:text-5xl font-bold financial-value">
          {totalValue || '—'}
        </Typography>

        {!totalValue && (
          <Typography variant="body-sm">Unable to calculate total</Typography>
        )}
      </Stack>

      <Stack gap="sm">
        {totalValue && (
          <Stack direction="horizontal" gap="md" className="items-center flex-wrap">
            <Stack direction="horizontal" gap="sm" className="items-center">
              <Typography
                variant="body-sm"
                className={isGainPositive ? 'text-(--positive) font-medium' : isGainNeutral ? 'font-medium' : 'text-(--negative) font-medium'}
              >
                {gainLossPercentage}
              </Typography>
              <Typography variant="caption" className="text-(--text-muted)">all time</Typography>
            </Stack>

            <Divider direction="vertical" className="h-4" />

            <Stack direction="horizontal" gap="sm" className="items-center">
              <Typography
                variant="body-sm"
                className={isTodayPositive ? 'text-(--positive) font-medium' : 'text-(--negative) font-medium'}
              >
                {todayChangePercentage}
              </Typography>
              <Typography variant="caption" className="text-(--text-muted)">today</Typography>
            </Stack>
          </Stack>
        )}

        {(excludedCount || disclaimer) && (
          <Stack gap="xs">
            {(excludedCount ?? 0) > 0 && (
              <Typography variant="caption" className="text-(--text-muted)">
                {excludedCount} holding{(excludedCount ?? 0) > 1 ? 's' : ''} excluded from total
              </Typography>
            )}
            {disclaimer && totalValue && (
              <div className="flex items-center gap-1.5 text-muted-foreground/60">
                <Info className="w-3 h-3" />
                <Typography variant="caption" className="italic">
                  {disclaimer}
                </Typography>
              </div>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
