import Decimal from 'decimal.js'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Card, CardHeader, CardTitle, CardContent } from '@/frontend/components/ui/card'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { cn } from '@/frontend/utils/cn'

interface SimulationBreakdownProps {
  selectedItems: Map<string, HoldingItemVM>
  quantityOverrides: Record<string, number>
  priceMap: Map<string, number>
}

export function SimulationBreakdown({ selectedItems, quantityOverrides, priceMap }: SimulationBreakdownProps) {
  const { t } = useLanguage()

  // Helper formatters
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPct = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  if (selectedItems.size === 0) {
    return (
      <Card className="border-dashed">
        <Typography as="p" variant="body-sm" className="p-12 text-center text-muted-foreground">
          {t('buybackSimulation.breakdown.noSelection')}
        </Typography>
      </Card>
    )
  }

  const items = Array.from(selectedItems.values())

  return (
    <Card>
      <CardHeader className="py-4 md:py-6">
        <CardTitle className="text-base md:text-lg font-semibold">{t('buybackSimulation.breakdown.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3">{t('buybackSimulation.table.brand')} / {t('buybackSimulation.table.gram')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.breakdown.gramSold')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.table.buybackPrice')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.breakdown.buybackValue')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.breakdown.costBasis')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.breakdown.pnl')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(item => {
                const qtyToSell = quantityOverrides[item.id] ?? item.quantity
                if (qtyToSell <= 0) return null

                // Calculations (using decimal.js for financial precision)
                const priceKey = `${item.brand}:${item.rawWeight}`
                const buybackPrice = priceMap.get(priceKey) || 0
                const buybackValueD = new Decimal(buybackPrice).mul(qtyToSell)
                const costBasisD = new Decimal(item.rawAvgBuyPrice).mul(qtyToSell)
                const pnlD = buybackValueD.minus(costBasisD)
                const buybackValue = buybackValueD.toNumber()
                const costBasis = costBasisD.toNumber()
                const pnl = pnlD.toNumber()
                const pnlPct = costBasisD.gt(0) ? pnlD.div(costBasisD).mul(100).toNumber() : 0

                const pnlColor = pnl > 0
                  ? 'text-green-600 dark:text-green-400'
                  : pnl < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'

                return (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Typography as="div" variant="body-sm" className="font-medium text-foreground">{item.brandName}</Typography>
                      <Typography as="div" variant="caption" className="text-muted-foreground">{item.weight}</Typography>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {qtyToSell} <span className="text-muted-foreground text-xs">pcs</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {buybackPrice > 0 ? formatIDR(buybackPrice) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatIDR(buybackValue)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatIDR(costBasis)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Typography as="div" variant="body-sm" className={cn("font-medium", pnlColor)}>
                        {pnl > 0 ? '+' : ''}{formatIDR(pnl)}
                      </Typography>
                      <Typography as="div" variant="caption" className={cn(pnlColor)}>
                        {formatPct(pnlPct)}
                      </Typography>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
