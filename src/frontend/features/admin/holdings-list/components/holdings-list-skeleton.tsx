/**
 * Holdings List Skeleton
 */

import { Stack } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

export function HoldingCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6 min-h-[200px] md:min-h-[132px]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HoldingsListSkeleton() {
  const { t } = useLanguage()

  return (
    <Stack gap="sm">
      {/* 1. Action Bar Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* 2. Portfolio Summary Skeleton (Single Wide Card) */}
      <HoldingCardSkeleton />
      {/* 3. Table Skeleton (Holdings List) */}
      <div className="py-6">
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                      {t('holdings.table.date')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                      {t('holdings.table.weight')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                      {t('holdings.table.buyPrice')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                      {t('holdings.table.currentValue')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-(--foreground-muted)">
                      {t('holdings.table.pnl')}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-border">
                    {/* Date Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 text-left">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16 opacity-60" />
                      </div>
                    </td>

                    {/* Weight + Brand Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5 text-left">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-24 opacity-60" />
                      </div>
                    </td>

                    {/* Buy Price Column */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Skeleton className="h-5 w-28 ml-auto" />
                    </td>

                    {/* Current Value Column */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Skeleton className="h-5 w-32 ml-auto" />
                    </td>

                    {/* PnL Column */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="w-3 h-3 rounded-full" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-3 w-12 opacity-60" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Stack>
  )
}
