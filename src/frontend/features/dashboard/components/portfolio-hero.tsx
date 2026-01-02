'use client'

import { Stack, Section, Divider } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'

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
    <Section className="px-4 pt-6 pb-6">
      <Stack gap="md">
        <Stack gap="xs">
          <Typography variant="h4">Portfolio Value</Typography>
          <Typography as="h1" className="text-4xl md:text-5xl font-bold financial-value">
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
                className={isGainPositive ? 'text-[var(--positive)] font-medium' : 'text-[var(--negative)] font-medium'}
              >
                {formatPercentage(gainLossPercentage)}
              </Typography>
              <Typography variant="caption" className="text-[var(--text-muted)]">all time</Typography>
            </Stack>

            <Divider direction="vertical" className="h-4" />

            <Stack direction="horizontal" gap="sm" className="items-center">
              <Typography
                variant="body-sm"
                className={isTodayPositive ? 'text-[var(--positive)] font-medium' : 'text-[var(--negative)] font-medium'}
              >
                {formatPercentage(todayChangePercentage)}
              </Typography>
              <Typography variant="caption" className="text-[var(--text-muted)]">today</Typography>
            </Stack>
          </Stack>
        )}

        {(excludedCount || disclaimer) && (
          <Stack gap="xs">
            {excludedCount && excludedCount > 0 && (
              <Typography variant="caption" className="text-[var(--text-muted)]">
                {excludedCount} holding{excludedCount > 1 ? 's' : ''} excluded from total
              </Typography>
            )}
            {disclaimer && hasValue && (
              <Typography variant="caption" className="italic">
                {disclaimer}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Section>
  )
}
