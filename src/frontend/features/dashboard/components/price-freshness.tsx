'use client'

import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Typography } from '@/frontend/components/ui/typography'
import { useLanguage } from '@/frontend/hooks/use-language'

interface PriceFreshnessProps {
  lastUpdated?: Date
  isLoading?: boolean
}

export default function PriceFreshness({ lastUpdated, isLoading }: PriceFreshnessProps) {
  const { t, language } = useLanguage()
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }

  if (!lastUpdated) return null

  return (
    <div className="flex items-center gap-2 text-muted-foreground/60">
      <div className="w-2 h-2 rounded-full bg-(--positive) animate-pulse" />
      <Typography variant="caption">
        {t('dashboard.lastUpdated')}: {lastUpdated.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: 'numeric', minute: '2-digit' })}
      </Typography>
    </div>
  )
}
