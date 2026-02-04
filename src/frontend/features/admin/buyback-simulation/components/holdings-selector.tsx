import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Checkbox } from '@/frontend/components/ui/checkbox'
import { Input } from '@/frontend/components/ui/input'
import { Button } from '@/frontend/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'

interface HoldingsSelectorProps {
  holdings: HoldingItemVM[]
  selectedIds: Set<string>
  quantityOverrides: Record<string, number>
  priceMap: Map<string, number>
  onToggle: (item: HoldingItemVM) => void
  onUpdateQuantity: (id: string, qty: number) => void
  pagination: { pageIndex: number; pageSize: number }
  totalItems: number
  pageCount: number
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void
  isLoading?: boolean
}

export function HoldingsSelector({
  holdings,
  selectedIds,
  quantityOverrides,
  priceMap,
  onToggle,
  onUpdateQuantity,
  pagination,
  totalItems,
  pageCount,
  onPaginationChange,
  isLoading
}: HoldingsSelectorProps) {
  const { t } = useLanguage()

  // Format IDR helper
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  if (holdings.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">{t('holdings.table.empty')}</div>
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="w-12 px-4 py-3 text-center">{t('buybackSimulation.table.select')}</th>
                <th className="px-4 py-3">{t('buybackSimulation.table.brand')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.table.gram')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.table.buyPrice')}</th>
                <th className="px-4 py-3 text-right">{t('buybackSimulation.table.buybackPrice')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {holdings.map(item => {
                const isSelected = selectedIds.has(item.id)
                const priceKey = `${item.brand}:${item.rawWeight}`
                const buybackPrice = priceMap.get(priceKey)

                return (
                  <tr
                    key={item.id}
                    className={cn("hover:bg-muted/30 transition-colors cursor-pointer", isSelected && "bg-primary/5")}
                    onClick={() => onToggle(item)}
                  >
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggle(item)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.brandName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.weight}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatIDR(item.rawAvgBuyPrice)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {buybackPrice ? (
                        <span className="font-medium text-foreground">{formatIDR(buybackPrice)}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-muted-foreground">
          {t('holdings.pagination.showing', {
            from: pagination.pageIndex * pagination.pageSize + 1,
            to: Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems),
            total: totalItems
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
            disabled={pagination.pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-xs font-medium">
            {pagination.pageIndex + 1} / {pageCount}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
            disabled={pagination.pageIndex >= pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
