import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Checkbox } from '@/frontend/components/ui/checkbox'
import { Input } from '@/frontend/components/ui/input'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
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
    return <Typography as="p" variant="body-sm" className="p-8 text-center text-muted-foreground">Loading...</Typography>
  }

  if (holdings.length === 0) {
    return <Typography as="p" variant="body-sm" className="p-8 text-center text-muted-foreground">{t('holdings.table.empty')}</Typography>
  }

  return (
    <Stack gap="md">
      <Stack gap="sm">
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
              <Stack direction="horizontal" className="items-start justify-between mb-3">
                <Stack direction="horizontal" gap="sm" className="items-center">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Stack gap="xs">
                    <Typography as="div" variant="body-sm" className="font-semibold text-foreground">{item.brandName}</Typography>
                    <Typography as="div" variant="caption" className="text-muted-foreground">{item.buyDate}</Typography>
                  </Stack>
                </Stack>
                <Stack className="text-right" gap="xs">
                  <Typography as="div" variant="body-sm" className="font-medium">{item.weight}</Typography>
                  <Typography as="div" variant="caption" className="text-muted-foreground">
                    Buy: {formatIDR(item.rawAvgBuyPrice)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="horizontal" className="items-center justify-between p-2 bg-muted/40 rounded-md">
                <Stack gap="xs" className="text-xs">
                  <Typography as="div" variant="caption" className="text-muted-foreground mb-0.5">{t('buybackSimulation.table.buybackPrice')}</Typography>
                  {buybackPrice ? (
                    <Typography as="div" variant="body-sm" className="font-medium text-foreground">{formatIDR(buybackPrice)}</Typography>
                  ) : (
                    <Typography as="div" variant="caption" className="italic text-muted-foreground">-</Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
          )
        })}
      </Stack>

      {/* Pagination */}
      <Stack direction="horizontal" className="items-center justify-between px-2 pt-2">
        <Typography as="p" variant="caption" className="text-muted-foreground">
          {pagination.pageIndex + 1} / {pageCount} ({totalItems} items)
        </Typography>
        <Stack direction="horizontal" gap="sm" className="items-center">
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
        </Stack>
      </Stack>
    </Stack>
  )
}
