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
          <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
            {t('holdings.table.date')}
          </Typography>
        ),
        cell: ({ getValue }) => {
          const dateStr = getValue() as string
          if (dateStr === '—') {
            return (
              <div className="flex flex-col">
                <Typography variant="body-sm">{dateStr}</Typography>
              </div>
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
            <div className="flex flex-col">
              <Typography variant="body-sm">{dateStr}</Typography>
              {durationLabel && (
                <Typography variant="caption" className="text-muted-foreground text-xs">
                  {durationLabel}
                </Typography>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'weight',
        header: () => (
          <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
            {t('holdings.table.weight')}
          </Typography>
        ),
        cell: ({ row }) => (
          <Stack gap="xs">
            <Typography variant="body-sm" className="font-medium">
              {row.original.weight}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground flex items-center gap-2">
              {row.original.brandName}
              {row.original.isSold && (
                <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                  {t('holdings.filters.options.sold').toUpperCase()}
                </span>
              )}
            </Typography>
          </Stack>
        ),
      },
      {
        accessorKey: 'avgBuyPrice',
        header: () => ( // Align Right
          <div className="text-right">
            <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
              {t('holdings.table.buyPrice')}
            </Typography>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right">
            <Typography variant="body-sm" className="financial-value">
              {getValue() as string}
            </Typography>
          </div>
        ),
      },
      {
        accessorKey: 'totalValue',
        header: () => ( // Align Right
          <div className="text-right">
            <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
              {t('holdings.table.currentValue')}
            </Typography>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right">
            <Typography variant="body-sm" className="financial-value font-medium">
              {getValue() as string}
            </Typography>
          </div>
        ),
      },
      { // PnL Column
        id: 'pnl',
        header: () => ( // Align Right
          <div className="text-right">
            <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
              {t('holdings.table.pnl')}
            </Typography>
          </div>
        ),
        cell: ({ row }) => {
          const holding = row.original
          return (
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
          )
        },
      },
    ],
    [t]
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
      <div className="text-center py-12 text-(--foreground-muted)">
        <Typography variant="body">{t('holdings.table.empty')}</Typography>
      </div>
    )
  }

  // Calculate current view range for footer
  const { pageIndex, pageSize } = table.getState().pagination
  const currentTotal = isServerPagination ? (totalItems ?? 0) : holdings.length

  const from = currentTotal > 0 ? (pageIndex * pageSize) + 1 : 0
  const to = Math.min((pageIndex + 1) * pageSize, currentTotal)

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-(--border)">
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  const holdingId = row.original.id;
                  // Ensure router path is constructed correctly
                  const target = ROUTES.HOLDING_DETAIL(holdingId) + (backUrl ? `?backUrl=${encodeURIComponent(backUrl)}` : '')
                  router.push(target)
                }}
                className="border-b border-(--border) hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cn(
                    "py-4 px-4 whitespace-nowrap",
                    cell.column.id === 'avgBuyPrice' || cell.column.id === 'totalValue' || cell.column.id === 'pnl' ? "text-right" : "text-left"
                  )}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {t('holdings.pagination.showing')
            .replace('{from}', from.toString())
            .replace('{to}', to.toString())
            .replace('{total}', currentTotal.toString())
          }
        </div>
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </div>
  )
}
