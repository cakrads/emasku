'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'

interface HoldingsTableProps {
  holdings: HoldingItemVM[]
  backUrl?: string
}

export default function HoldingsTable({ holdings, backUrl }: HoldingsTableProps) {
  const router = useRouter()
  const { t } = useLanguage()

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12 text-(--foreground-muted)">
        <Typography variant="body">{t('holdings.table.empty')}</Typography>
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
                {t('holdings.table.date')}
              </Typography>
            </th>
            <th className="text-left py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                {t('holdings.table.weight')}
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                {t('holdings.table.buyPrice')}
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                {t('holdings.table.currentValue')}
              </Typography>
            </th>
            <th className="text-right py-3 px-4">
              <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                {t('holdings.table.pnl')}
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            return (
              <tr
                key={holding.id}
                onClick={() => {
                  const target = ROUTES.HOLDING_DETAIL(holding.id) + (backUrl ? `?backUrl=${encodeURIComponent(backUrl)}` : '')
                  router.push(target)
                }}
                className="border-b border-(--border) hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-4">
                  <Typography variant="body-sm">{holding.buyDate}</Typography>
                </td>
                <td className="py-4 px-4">
                  <Stack gap="xs">
                    <Typography variant="body-sm" className="font-medium">
                      {holding.weight}
                    </Typography>
                    <Typography variant="caption" className="text-muted-foreground flex items-center gap-2">
                      {holding.brandName}
                      {holding.isSold && (
                        <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                          {t('holdings.filters.options.sold').toUpperCase()}
                        </span>
                      )}
                    </Typography>
                  </Stack>
                </td>
                <td className="py-4 px-4 text-right">
                  <Typography variant="body-sm" className="financial-value">
                    {holding.avgBuyPrice}
                  </Typography>
                </td>
                <td className="py-4 px-4 text-right">
                  <Typography variant="body-sm" className="financial-value font-medium">
                    {holding.totalValue}
                  </Typography>
                </td>
                <td className="py-4 px-4 text-right">
                  <Stack direction="horizontal" gap="xs" className="justify-end items-center">
                    {holding.pnlColor === 'positive' && (
                      <TrendingUp className="w-3 h-3 text-(--positive)" />
                    )}
                    {holding.pnlColor === 'negative' && (
                      <TrendingDown className="w-3 h-3 text-(--negative)" />
                    )}
                    <Stack gap="none" className="items-end">
                      <Typography
                        variant="body-sm"
                        className={cn(
                          'font-semibold',
                          holding.pnlColor === 'positive' ? 'text-(--positive)' : holding.pnlColor === 'negative' ? 'text-(--negative)' : ''
                        )}
                      >
                        {holding.pnl}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={cn(
                          holding.pnlColor === 'positive' ? 'text-(--positive)' : holding.pnlColor === 'negative' ? 'text-(--negative)' : ''
                        )}
                      >
                        {holding.pnlPercentage}
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
