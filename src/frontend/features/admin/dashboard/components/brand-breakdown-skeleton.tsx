import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'

export function BrandBreakdownSkeleton() {
  return (
    <Stack gap="md" aria-hidden="true">
      {/* SectionHeader skeleton */}
      <Stack direction="horizontal" gap="md" className="items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20" />
      </Stack>

      {/* 2-col grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Stack key={i} gap="sm" className="bg-surface border border-border rounded-xl p-4">
            <Stack direction="horizontal" gap="sm" className="items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </Stack>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-24" />
          </Stack>
        ))}
      </div>
    </Stack>
  )
}
