'use client'

import { Stack, Section } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { formatCurrency, formatWeight, formatPercentage } from '@/frontend/utils/aggregations'

interface BrandSummaryProps {
  brandName: string
  totalWeight: number
  totalBuyValue: number
  totalCurrentValue: number
  unrealizedPL: number
  unrealizedPLPercentage: number
  holdingsCount: number
}

export default function BrandSummary({
  brandName,
  totalWeight,
  totalBuyValue,
  totalCurrentValue,
  unrealizedPL,
  unrealizedPLPercentage,
  holdingsCount,
}: BrandSummaryProps) {
  const isPositive = unrealizedPL >= 0

  return (
    <Section className="bg-surface-elevated border border-border rounded-xl p-6">
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="none">
          <Typography variant="h1">{brandName}</Typography>
          <Typography variant="body-sm" className="text-(--foreground-muted)">
            {holdingsCount} {holdingsCount === 1 ? 'holding' : 'holdings'} • {formatWeight(totalWeight)}
          </Typography>
        </Stack>

        {/* Current Value */}
        <Stack gap="xs">
          <Typography variant="body-sm" className="text-(--foreground-muted)">
            Current Value
          </Typography>
          <Typography variant="h1" className="financial-value">
            {formatCurrency(totalCurrentValue)}
          </Typography>
        </Stack>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Buy Value */}
          <Stack gap="xs">
            <Typography variant="body-sm" className="text-(--foreground-muted)">
              Total Buy Value
            </Typography>
            <Typography variant="h3" className="financial-value">
              {formatCurrency(totalBuyValue)}
            </Typography>
          </Stack>

          {/* Unrealized P/L */}
          <Stack gap="xs">
            <Typography variant="body-sm" className="text-(--foreground-muted)">
              Unrealized P/L
            </Typography>
            <Stack direction="horizontal" gap="sm" className="items-center">
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-(--positive)" />
              ) : (
                <TrendingDown className="w-5 h-5 text-(--negative)" />
              )}
              <Typography
                variant="h3"
                className={cn(
                  'financial-value',
                  isPositive ? 'text-(--positive)' : 'text-(--negative)'
                )}
              >
                {formatCurrency(Math.abs(unrealizedPL))}
              </Typography>
            </Stack>
          </Stack>

          {/* P/L Percentage */}
          <Stack gap="xs">
            <Typography variant="body-sm" className="text-(--foreground-muted)">
              Return
            </Typography>
            <Typography
              variant="h3"
              className={cn(
                'font-semibold',
                isPositive ? 'text-(--positive)' : 'text-(--negative)'
              )}
            >
              {formatPercentage(unrealizedPLPercentage)}
            </Typography>
          </Stack>
        </div>
      </Stack>
    </Section>
  )
}
