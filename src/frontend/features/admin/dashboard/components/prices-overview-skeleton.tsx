/**
 * Market Overview Skeleton
 *
 * Loading state for market today cards.
 * IMPORTANT: Heights and grid must match prices-today-cards.tsx to prevent CLS.
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'
import { useLanguage } from '@/frontend/hooks/use-language'

export function PricesOverviewSkeleton() {
  const { t } = useLanguage()

  return (
    <Stack className="min-h-[240px] md:min-h-[220px]">
      {/* Header - matches prices-today-cards header */}
      <Stack direction="horizontal" gap="md" className="items-center justify-between mb-4">
        <Stack gap="xs">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-40" />
        </Stack>
        <Skeleton className="h-4 w-32 hidden md:block" />
        <Skeleton className="h-4 w-4 md:hidden" />
      </Stack>

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 hide-scrollbar">
        {/* Show 3 cards on mobile/tablet/desktop for loading */}
        {[1, 2, 3, 4].map((i) => (
          <Stack
            key={i}
            className="shrink-0 w-[85%] max-w-[280px] snap-center md:w-auto md:max-w-none md:snap-none p-4 rounded-xl border border-border bg-background min-h-[180px]"
          >
            {/* Brand name */}
            <Skeleton className="h-4 w-24 mb-4" />

            <Stack gap="lg">
              {/* Price 1 placeholder */}
              <Stack gap="xs">
                <Skeleton className="h-2 w-16 opacity-70" />
                <Stack direction="horizontal" gap="xs" className="items-baseline mt-0.5">
                  <Skeleton className="h-6 w-32" />
                </Stack>
                <Stack className="mt-1">
                  <Skeleton className="h-3 w-24 opacity-50" />
                </Stack>
              </Stack>

              {/* Price 2 placeholder */}
              <Stack gap="xs">
                <Skeleton className="h-2 w-16 opacity-70" />
                <Stack direction="horizontal" gap="xs" className="items-baseline mt-0.5">
                  <Skeleton className="h-6 w-28" />
                </Stack>
                <Stack className="mt-1">
                  <Skeleton className="h-3 w-20 opacity-50" />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        ))}


      </div>
    </Stack>
  )
}
