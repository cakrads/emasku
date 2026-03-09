/**
 * Holdings List Skeleton
 */

import { Stack } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

export function HoldingCardSkeleton() {
  return (
    <div className="bg-linear-to-r from-teal-50/80 via-white to-white dark:from-teal-950/20 dark:via-background dark:to-background rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-teal-900/50 min-h-[220px] md:min-h-[145px]">
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
      {/* 1. Quick Action Chips Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-40 rounded-full" />
      </div>

      {/* 2. Filter Row Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-16 rounded-full" />
        <Skeleton className="h-9 w-12 rounded-full" />
        <div className="h-6 w-px bg-border mx-1" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>

      {/* 3. Portfolio Summary Card */}
      <HoldingCardSkeleton />

      {/* 4. Holdings List Skeleton – Mobile */}
      <div className="md:hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right space-y-1.5">
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Holdings List Skeleton – Desktop */}
      <div className="hidden md:block py-6">
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-muted-foreground">
                      {t('holdings.table.date')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-muted-foreground">
                      {t('holdings.table.weight')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-muted-foreground">
                      {t('holdings.table.buyPrice')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-muted-foreground">
                      {t('holdings.table.currentValue')}
                    </Typography>
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    <Typography variant="caption" className="font-semibold text-muted-foreground">
                      {t('holdings.table.pnl')}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16 opacity-60" />
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-24 opacity-60" />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Skeleton className="h-5 w-28 ml-auto" />
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Skeleton className="h-5 w-32 ml-auto" />
                    </td>
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
