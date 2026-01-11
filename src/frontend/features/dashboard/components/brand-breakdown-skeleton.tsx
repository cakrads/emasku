import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, ScrollArea } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'

export function BrandBreakdownSkeleton() {
  return (
    <Stack gap="md">
      <Stack gap="none">
        <Typography as="h2" variant="h3">Holdings</Typography>
        <Typography variant="body-sm">By brand</Typography>
      </Stack>
      <ScrollArea>
        <div className="flex gap-4 pb-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="shrink-0 w-[280px] h-[180px] bg-(--surface-elevated) border border-(--border) rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-auto space-y-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </ScrollArea>
    </Stack>
  )
}
