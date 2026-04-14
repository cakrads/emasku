'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
} from '@tanstack/react-table'
import { intervalToDuration } from 'date-fns' // Added import
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'
import { HoldingItemVM } from '@/frontend/view-model/portfolio.vm'
import { useLanguage } from '@/frontend/hooks/use-language'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

interface HoldingsTableProps {
  holdings: HoldingItemVM[]
  backUrl?: string
  // Pagination props are optional to support client-side mode (e.g. Brand Detail view)
  pageCount?: number
  totalItems?: number
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  isLoading?: boolean
}

export default function HoldingsTable({
  holdings,
  backUrl,
  pageCount,
  totalItems,
  pagination,
  onPaginationChange,
  isLoading
}: HoldingsTableProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()

  // Determine if we are in server-side pagination mode
  const isServerPagination =
    typeof pageCount === 'number' &&
    typeof totalItems === 'number' &&
    !!pagination &&
    !!onPaginationChange

  const columns = useMemo<ColumnDef<HoldingItemVM>[]>(
    () => [
      {
        accessorKey: 'buyDate',
        header: () => (
          <Typography variant="caption" className="font-semibold text-muted-foreground">
            {t('holdings.table.date')}
          </Typography>
        ),
        cell: ({ getValue }) => {
          const dateStr = getValue() as string
          if (dateStr === '—') {
            return (
              <Stack>
                <Typography variant="body-sm">{dateStr}</Typography>
              </Stack>
            )
          }
          const buyDate = new Date(dateStr)
          const now = new Date()

          // Calculate duration
          const duration = intervalToDuration({
            start: buyDate,
            end: now
          })

          let durationLabel = ''
          const { years, months } = duration

          if (years && years > 0) {
            const yUnit = years === 1 ? t('common.duration.year') : t('common.duration.years')
            durationLabel = `${years} ${yUnit}`

            if (months && months > 0) {
              const mUnit = months === 1 ? t('common.duration.month') : t('common.duration.months')
              durationLabel += ` ${months} ${mUnit}`
            }
          } else if (months && months > 0) {
            const mUnit = months === 1 ? t('common.duration.month') : t('common.duration.months')
            durationLabel = `${months} ${mUnit}`
          }

          return (
            <Stack>
              <Typography variant="body-sm">{dateStr}</Typography>
              {durationLabel && (
                <Typography variant="caption" className="text-muted-foreground text-xs">
                  {durationLabel}
                </Typography>
              )}
            </Stack>
          )
        },
      },
      {
        accessorKey: 'weight',
        header: () => (
          <Typography variant="caption" className="font-semibold text-muted-foreground">
            {t('holdings.table.weight')}
          </Typography>
        ),
        cell: ({ row }) => (
          <Stack gap="xs">
            <Stack direction="horizontal" className="flex-wrap items-center gap-2">
              <Typography variant="body-sm" className="font-medium">
                {row.original.brandName} {row.original.weight}
              </Typography>
              {row.original.isSold && (
                <span className="inline-flex items-center rounded-md bg-orange-100 px-1.5 py-0.5 text-2xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                  {t('holdings.filters.options.sold').toUpperCase()}
                </span>
              )}
            </Stack>
            {row.original.goalId && (
              <Typography variant="caption" className="text-primary font-medium flex items-center gap-1">
                <span className="text-muted-foreground font-normal">{t('goals.title')}:</span>
                {row.original.goalName || 'Goal'}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        accessorKey: 'avgBuyPrice',
        header: () => ( // Align Right
          <Stack className="text-right">
            <Typography variant="caption" className="font-semibold text-muted-foreground">
              {t('holdings.table.buyPrice')}
            </Typography>
          </Stack>
        ),
        cell: ({ getValue }) => (
          <Stack className="text-right">
            <Typography variant="body-sm" className="financial-value">
              {isVisible ? (getValue() as string) : '••••••••'}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'totalValue',
        header: () => ( // Align Right
          <Stack className="text-right">
            <Typography variant="caption" className="font-semibold text-muted-foreground">
              {t('holdings.table.currentValue')}
            </Typography>
          </Stack>
        ),
        cell: ({ getValue }) => (
          <Stack className="text-right">
            <Typography variant="body-sm" className="financial-value font-medium">
              {isVisible ? (getValue() as string) : '••••••••'}
            </Typography>
          </Stack>
        ),
      },
      { // PnL Column
        id: 'pnl',
        header: () => ( // Align Right
          <Stack className="text-right">
            <Typography variant="caption" className="font-semibold text-muted-foreground">
              {t('holdings.table.pnl')}
            </Typography>
          </Stack>
        ),
        cell: ({ row }) => {
          const holding = row.original
          return (
            <Stack direction="horizontal" gap="xs" className="justify-end items-center">
              {holding.pnlColor === 'positive' && (
                <TrendingUp className="w-3 h-3 text-positive" />
              )}
              {holding.pnlColor === 'negative' && (
                <TrendingDown className="w-3 h-3 text-negative" />
              )}
              <Stack gap="none" className="items-end">
                <Typography
                  variant="body-sm"
                  className={cn(
                    'font-semibold',
                    holding.pnlColor === 'positive' ? 'text-positive' : holding.pnlColor === 'negative' ? 'text-negative' : ''
                  )}
                >
                  {isVisible ? holding.pnl : '••••••••'}
                </Typography>
                <Typography
                  variant="caption"
                  className={cn(
                    holding.pnlColor === 'positive' ? 'text-positive' : holding.pnlColor === 'negative' ? 'text-negative' : ''
                  )}
                >
                  {isVisible ? holding.pnlPercentage : '•••%'}
                </Typography>
              </Stack>
            </Stack>
          )
        },
      },
    ],
    [t, isVisible]
  )

  const table = useReactTable({
    data: holdings,
    columns,
    pageCount: isServerPagination ? pageCount : undefined,
    state: isServerPagination ? { pagination } : undefined,
    onPaginationChange: (updater) => {
      if (isServerPagination && onPaginationChange) {
        if (typeof updater === 'function') {
          // We know pagination is defined if isServerPagination is true
          onPaginationChange(updater(pagination!));
        } else {
          onPaginationChange(updater);
        }
      }
      // If client side, internal state handling kicks in automatically if we don't return anything
    },
    manualPagination: isServerPagination,
    getCoreRowModel: getCoreRowModel(),
    // Add pagination model for client-side mode
    getPaginationRowModel: !isServerPagination ? getPaginationRowModel() : undefined,
  })

  if (holdings.length === 0 && !isLoading) {
    return (
      <Stack className="text-center py-12 text-foreground-muted">
        <Typography variant="body">{t('holdings.table.empty')}</Typography>
      </Stack>
    )
  }

  // Calculate current view range for footer
  const { pageIndex, pageSize } = table.getState().pagination
  const currentTotal = isServerPagination ? (totalItems ?? 0) : holdings.length

  const from = currentTotal > 0 ? (pageIndex * pageSize) + 1 : 0
  const to = Math.min((pageIndex + 1) * pageSize, currentTotal)

  return (
    <Stack gap="md">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" aria-label="Holdings Table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={cn(
                    "py-3 px-4 text-left whitespace-nowrap font-medium",
                    header.column.id === 'avgBuyPrice' || header.column.id === 'totalValue' || header.column.id === 'pnl' ? "text-right" : "text-left"
                  )}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            {table.getRowModel().rows.map((row) => {
              const isSold = row.original.isSold
              return (
                <tr
                  key={row.id}
                  onClick={() => {
                    const holdingId = row.original.id;
                    const target = ROUTES.HOLDING_DETAIL(holdingId) + (backUrl ? `?backUrl=${encodeURIComponent(backUrl)}` : '')
                    router.push(target)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      const holdingId = row.original.id;
                      const target = ROUTES.HOLDING_DETAIL(holdingId) + (backUrl ? `?backUrl=${encodeURIComponent(backUrl)}` : '')
                      router.push(target)
                    }
                  }}
                  tabIndex={0}
                  className={cn(
                    "border-b border-border hover:bg-muted/50 cursor-pointer transition-colors group",
                    isSold && "bg-muted/20 hover:bg-muted/40"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cn(
                      "py-4 px-4 whitespace-nowrap",
                      isSold && "opacity-70",
                      cell.column.id === 'avgBuyPrice' || cell.column.id === 'totalValue' || cell.column.id === 'pnl' ? "text-right" : "text-left"
                    )}>
                      {cell.column.id === 'pnl' && isSold && (
                        <Stack direction="horizontal" className="justify-end mb-0.5">
                          <span className="text-2xs uppercase font-bold tracking-wider text-muted-foreground bg-muted px-1 rounded-sm">
                            {t('holdingDetail.sellInfo.realized')}
                          </span>
                        </Stack>
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Stack direction="horizontal" className="items-center justify-between px-2">
        <Typography variant="body-sm" className="flex-1 text-muted-foreground">
          {t('holdings.pagination.showing')
            .replace('{from}', from.toString())
            .replace('{to}', to.toString())
            .replace('{total}', currentTotal.toString())
          }
        </Typography>
        <Stack direction="horizontal" gap="sm" className="items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
