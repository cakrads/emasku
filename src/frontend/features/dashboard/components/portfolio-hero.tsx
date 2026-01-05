'use client'

import { Stack, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Info } from 'lucide-react'

interface PortfolioHeroProps {
  totalValue: number | null
  totalGainLoss: number
  gainLossPercentage: number
  todayChange: number
  todayChangePercentage: number
  disclaimer?: string
  excludedCount?: number
}

export default function PortfolioHero({
  totalValue,
  totalGainLoss,
  gainLossPercentage,
  todayChange,
  todayChangePercentage,
  disclaimer,
  excludedCount,
}: PortfolioHeroProps) {
  const isGainPositive = totalGainLoss >= 0
  const isTodayPositive = todayChange >= 0
  const hasValue = totalValue !== null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Typography variant="h4" className='mb-2'>Portfolio Value</Typography>
        <Typography as="h1" className="text-5xl md:text-5xl font-bold financial-value">
          {hasValue ? formatCurrency(totalValue) : '—'}
        </Typography>

        {!hasValue && (
          <Typography variant="body-sm">Unable to calculate total</Typography>
        )}
      </Stack>

      {hasValue && (
        <Stack direction="horizontal" gap="md" className="items-center flex-wrap">
          <Stack direction="horizontal" gap="sm" className="items-center">
            <Typography
              variant="body-sm"
              className={isGainPositive ? 'text-(--positive) font-medium' : 'text-(--negative) font-medium'}
            >
              {formatPercentage(gainLossPercentage)}
            </Typography>
            <Typography variant="caption" className="text-(--text-muted)">all time</Typography>
          </Stack>

          <Divider direction="vertical" className="h-4" />

          <Stack direction="horizontal" gap="sm" className="items-center">
            <Typography
              variant="body-sm"
              className={isTodayPositive ? 'text-(--positive) font-medium' : 'text-(--negative) font-medium'}
            >
              {formatPercentage(todayChangePercentage)}
            </Typography>
            <Typography variant="caption" className="text-(--text-muted)">today</Typography>
          </Stack>
        </Stack>
      )}

      {(excludedCount || disclaimer) && (
        <Stack gap="xs">
          {excludedCount && excludedCount > 0 && (
            <Typography variant="caption" className="text-(--text-muted)">
              {excludedCount} holding{excludedCount > 1 ? 's' : ''} excluded from total
            </Typography>
          )}
          {disclaimer && hasValue && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground/60">
              <Info className="w-3 h-3" />
              <Typography variant="caption" className="italic">
                {disclaimer}
              </Typography>
            </div>
          )}
        </Stack>
      )}
    </Stack>
  )
}
