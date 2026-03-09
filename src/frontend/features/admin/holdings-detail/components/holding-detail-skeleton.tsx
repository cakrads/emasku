/**
 * Holding Detail Skeleton
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, Section, Divider } from '@/frontend/components/ui/layout'

export function HoldingDetailSkeleton() {
  return (
    <Stack className="w-full max-w-xl mx-auto pb-24 sm:min-w-[500px]" gap="md">
      {/* Hero / Current Value */}
      <Section className="px-6 text-center mb-4">
        <Stack gap="sm" className="items-center">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24 mt-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-32 mt-2" />
        </Stack>
      </Section>

      {/* Purchase Details Card */}
      <Stack className="border border-border rounded-xl p-5" gap="md">
        <Skeleton className="h-5 w-32" />
        <Stack gap="md">
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-32" /></Stack>
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></Stack>
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /></Stack>
          <Divider />
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-6 w-32" /><Skeleton className="h-6 w-32" /></Stack>
        </Stack>
      </Stack>

      {/* Current Valuation Card */}
      <Stack className="border border-border rounded-xl p-5" gap="md">
        <Skeleton className="h-5 w-40" />
        <Stack gap="md">
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-24" /></Stack>
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></Stack>
          <Divider />
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-6 w-40" /><Skeleton className="h-6 w-32" /></Stack>
          <Stack direction="horizontal" className="justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /></Stack>
        </Stack>
      </Stack>

      {/* Action Pill Buttons */}
      <Stack direction="horizontal" gap="sm" className="flex-wrap mt-4">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-36 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </Stack>
    </Stack>
  )
}
