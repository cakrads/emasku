import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Checkbox } from '@/frontend/components/ui/checkbox'
import { Input } from '@/frontend/components/ui/input'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'

interface HoldingsSelectorMobileProps {
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

export function HoldingsSelectorMobile({
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
}: HoldingsSelectorMobileProps) {
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
      <div className="space-y-3">
        {holdings.map(item => {
          const isSelected = selectedIds.has(item.id)
          const priceKey = `${item.brand}:${item.rawWeight}`
          const buybackPrice = priceMap.get(priceKey)
          const qtyToSell = quantityOverrides[item.id] ?? item.quantity

          return (
            <Card
              key={item.id}
              className={cn(
                "p-3 transition-all active:scale-[0.99]",
                isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
              )}
              onClick={(e) => {
                // Toggle if clicking card body (not input)
                if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                  onToggle(item)
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <div className="font-semibold text-sm text-foreground">{item.brandName}</div>
                    <div className="text-xs text-muted-foreground">{item.buyDate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{item.weight}</div>
                  <div className="text-xs text-muted-foreground">
                    Buy: {formatIDR(item.rawAvgBuyPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                <div className="text-xs">
                  <div className="text-muted-foreground mb-0.5">{t('buybackSimulation.table.buybackPrice')}</div>
                  {buybackPrice ? (
                    <div className="font-medium text-foreground">{formatIDR(buybackPrice)}</div>
                  ) : (
                    <div className="italic text-muted-foreground">-</div>
                  )}
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Sell Qty</span>
                    <div className="flex items-center gap-2 justify-end">
                      <Input
                        type="number"
                        min={0}
                        max={item.quantity}
                        value={qtyToSell}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          onUpdateQuantity(item.id, Math.min(val, item.quantity))
                        }}
                        className="h-8 w-16 text-center px-1 text-sm bg-background"
                        disabled={!isSelected}
                      />
                      <span className="text-xs text-muted-foreground">/ {item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-xs text-muted-foreground">
          {pagination.pageIndex + 1} / {pageCount} ({totalItems} items)
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
