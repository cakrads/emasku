import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack, ScrollArea } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

export function BrandBreakdownSkeleton() {
  const { t } = useLanguage()

  return (
    <Stack gap="md">
      <Stack gap="none">
        <Typography as="h2" variant="h3">{t('dashboard.holdings')}</Typography>
        <Typography variant="body-sm">{t('dashboard.byBrand')}</Typography>
      </Stack>
      <ScrollArea>
        <Stack direction="horizontal" gap="md" className="pb-2">
          {[1, 2, 3].map(i => (
            <Stack
              key={i}
              gap="md"
              className="shrink-0 w-[280px] h-[184px] bg-(--surface-elevated) border border-(--border) rounded-xl p-4"
            >
              <Stack gap="sm">
                <Stack direction="horizontal" gap="sm" className="items-center">
                  <Skeleton className="h-6 w-32" />
                </Stack>
                <Skeleton className="h-4 w-16" />
              </Stack>
              <Stack gap="sm" className="mt-auto">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </Stack>
            </Stack>
          ))}
          <div className="w-2 shrink-0" />
        </Stack>
      </ScrollArea>
    </Stack>
  )
}
