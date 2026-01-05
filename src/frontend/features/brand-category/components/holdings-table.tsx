'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useRouter } from 'next/navigation'
import { Holding } from '@/frontend/data/dummy-holdings'
import {
  calculateHoldingValue,
  formatCurrency,
  formatWeight,
  formatDate,
  formatPercentage,
} from '@/frontend/utils/aggregations'
import { ROUTES } from '@/frontend/config/routes'

interface HoldingsTableProps {
  holdings: Holding[]
  backUrl?: string
}

export default function HoldingsTable({ holdings, backUrl }: HoldingsTableProps) {
  const router = useRouter()

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12 text-(--foreground-muted)">
        <Typography variant="body">No holdings found</Typography>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-(--border)">
            <th className="text-left py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                Date
              </Typography>
            </th>
            <th className="text-left py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                Weight
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                Buy Price
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                Current Value
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                P/L
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const { totalBuyValue, totalCurrentValue, profitLoss, profitLossPercentage } =
              calculateHoldingValue(holding)
            const isPositive = profitLoss >= 0

            return (
              <tr
                key={holding.id}
                onClick={() => {
                  const target = ROUTES.HOLDING_DETAIL(holding.id) + (backUrl ? `?backUrl=${encodeURIComponent(backUrl)}` : '')
                  router.push(target)
                }}
                className="border-b border-(--border) hover:bg-(--surface-elevated) cursor-pointer transition-colors"
              >
                <td className="py-4 px-4">
                  <Typography variant="body-sm">{formatDate(holding.buyDate)}</Typography>
                </td>
                <td className="py-4 px-4">
                  <Typography variant="body-sm" className="font-medium">
                    {formatWeight(holding.weight)}
                  </Typography>
                </td>
                <td className="py-4 px-4 text-right">
                  <Typography variant="body-sm" className="financial-value">
                    {formatCurrency(totalBuyValue)}
                  </Typography>
                </td>
                <td className="py-4 px-4 text-right">
                  <Typography variant="body-sm" className="financial-value font-medium">
                    {formatCurrency(totalCurrentValue)}
                  </Typography>
                </td>
                <td className="py-4 px-4 text-right">
                  <Stack direction="horizontal" gap="xs" className="justify-end items-center">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-(--positive)" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-(--negative)" />
                    )}
                    <Stack gap="none" className="items-end">
                      <Typography
                        variant="body-sm"
                        className={cn(
                          'font-semibold',
                          isPositive ? 'text-(--positive)' : 'text-(--negative)'
                        )}
                      >
                        {formatCurrency(Math.abs(profitLoss))}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={cn(
                          isPositive ? 'text-(--positive)' : 'text-(--negative)'
                        )}
                      >
                        {formatPercentage(profitLossPercentage)}
                      </Typography>
                    </Stack>
                  </Stack>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
