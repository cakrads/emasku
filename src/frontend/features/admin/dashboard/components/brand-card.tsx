'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp, Info } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/frontend/components/ui/tooltip'

import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

interface BrandCardProps {
  brandCode?: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'USER' | 'NONE' | 'MIXED'
}

export default function BrandCard({
  brandCode,
  brandName,
  totalGrams,
  currentValue,
  deltaValue,
  deltaPercentage,
  valuationSource,
}: BrandCardProps) {
  const { t, language } = useLanguage()
  const [hydrated, setHydrated] = useState(false)
  const { isVisible } = usePortfolioPrivacy()

  useEffect(() => { setHydrated(true) }, [])

  const isPositive = deltaValue >= 0
  const isUnvalued = valuationSource === 'NONE'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatWeight = (grams: number) =>
    `${new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(grams || 0)} g`

  const getValuationTooltip = () => {
    switch (valuationSource) {
      case 'BUYBACK': return t('dashboard.valuationTooltip.buyback')
      case 'USER': return t('dashboard.valuationTooltip.user')
      case 'MIXED': return t('dashboard.valuationTooltip.mixed')
      case 'NONE': return t('dashboard.valuationTooltip.none')
      default: return null
    }
  }

  const tooltipText = getValuationTooltip()

  const cardContent = (
    <Stack
      className="bg-surface border border-border rounded-xl p-4 transition-all group-hover:border-accent-gold/50 group-hover:bg-accent-gold/5 group-hover:shadow-sm h-full"
      gap="sm"
    >
      {/* Brand Avatar + Name */}
      <Stack direction="horizontal" gap="sm" className="items-center">
        <div className="w-8 h-8 rounded-full bg-accent-gold/15 flex items-center justify-center shrink-0">
          <Typography variant="caption" className="font-bold text-accent-gold uppercase text-xs">
            {brandName.charAt(0).toUpperCase()}
          </Typography>
        </div>
        <Typography
          variant="caption"
          className="font-medium text-muted-foreground truncate group-hover:text-accent-gold transition-colors text-xs min-w-0"
        >
          {brandName}
        </Typography>
      </Stack>

      {/* Weight - main value */}
      <Stack gap="xs">
        <Typography variant="h3" className="font-bold text-foreground financial-value">
          {hydrated && isVisible ? formatWeight(totalGrams) : '•••• g'}
        </Typography>
        {/* Current value - subtitle */}
        <Typography variant="caption" className="text-muted-foreground text-xs">
          {isUnvalued
            ? t('dashboard.brandCard.priceNotAvailable')
            : hydrated && isVisible ? formatCurrency(currentValue) : '••••••••'
          }
        </Typography>
      </Stack>

      {/* Delta chip */}
      {!isUnvalued && deltaValue !== 0 && (
        <Stack
          direction="horizontal"
          gap="xs"
          className={cn(
            'items-center w-fit px-2 py-1 rounded-md',
            isPositive ? 'bg-positive/10' : 'bg-negative/10'
          )}
        >
          <TrendingUp className={cn('w-3 h-3', isPositive ? 'text-positive' : 'rotate-180 text-negative')} />
          <Typography
            variant="caption"
            className={cn('font-semibold text-xs', isPositive ? 'text-positive' : 'text-negative')}
          >
            {hydrated && isVisible ? `${isPositive ? '+' : ''}${deltaPercentage.toFixed(2)}%` : '****%'}
          </Typography>
        </Stack>
      )}

      {isUnvalued && (
        <Typography variant="caption" className="text-muted-foreground italic text-xs">
          {t('dashboard.valuationTooltip.none')}
        </Typography>
      )}
    </Stack>
  )

  return (
    <div className="relative group">
      {brandCode ? (
        <Link href={ROUTES.BRAND_DETAIL(brandCode)} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl group">
          {cardContent}
        </Link>
      ) : (
        <div className="block rounded-xl">
          {cardContent}
        </div>
      )}
      {tooltipText && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={tooltipText}
                className="absolute top-4 right-4 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
              >
                <Info className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <Typography variant="caption">{tooltipText}</Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
