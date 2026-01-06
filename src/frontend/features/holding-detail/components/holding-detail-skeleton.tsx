/**
 * Holding Detail Skeleton
 */

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { PageWrapper, Container, Stack, Section } from '@/frontend/components/ui/layout'

export function HoldingDetailSkeleton() {
  return (
    <PageWrapper>
      <Container className="max-w-xl mx-auto pb-24 px-4 md:px-8 py-8">
        <Stack gap="xl">
          {/* Header / Breadcrumbs placeholder */}
          <div className="h-6 w-48 bg-muted/40 rounded animate-pulse mb-4" />

          {/* Hero / Current Value */}
          <Section className="px-6 text-center mb-4">
            <Stack gap="sm" className="items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-24 mt-2" />
            </Stack>
          </Section>

          {/* Purchase Details Card */}
          <div className="border border-border rounded-xl p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-32" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /></div>
              <div className="h-px bg-muted" />
              <div className="flex justify-between"><Skeleton className="h-6 w-32" /><Skeleton className="h-6 w-32" /></div>
            </div>
          </div>

          {/* Current Valuation Card */}
          <div className="border border-border rounded-xl p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <div className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-24" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
              <div className="h-px bg-muted" />
              <div className="flex justify-between"><Skeleton className="h-6 w-40" /><Skeleton className="h-6 w-32" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /></div>
            </div>
          </div>
        </Stack>
      </Container>
    </PageWrapper>
  )
}
