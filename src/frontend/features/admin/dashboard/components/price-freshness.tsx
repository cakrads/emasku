'use client'

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/frontend/components/ui/tooltip'
import { useLanguage } from '@/frontend/hooks/use-language'

interface PriceFreshnessProps {
  lastUpdated?: Date
  isLoading?: boolean
}

export default function PriceFreshness({ lastUpdated, isLoading }: PriceFreshnessProps) {
  const { t, language } = useLanguage()
  if (isLoading) {
    return (
      <Stack direction="horizontal" gap="sm" className="items-center">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </Stack>
    )
  }

  if (!lastUpdated) return null

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Stack direction="horizontal" gap="sm" className="items-center text-muted-foreground cursor-help">
            <div className="w-2 h-2 rounded-full bg-(--positive) animate-pulse" />
            <Typography variant="caption">
              {t('dashboard.lastUpdated')}: {lastUpdated.toLocaleString(language === 'id' ? 'id-ID' : 'en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </Typography>
          </Stack>
        </TooltipTrigger>
        <TooltipContent>
          <Typography variant="caption" className="max-w-xs">{t('dashboard.lastUpdatedTooltip')}</Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
