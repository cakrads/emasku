'use client'
import Link from 'next/link'

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
  brandCode: string
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
  const { isVisible } = usePortfolioPrivacy()
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

  const formatWeight = (grams: number) => `${new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grams || 0)} g`

  const getValuationTooltip = () => {
    switch (valuationSource) {
      case 'BUYBACK':
        return t('dashboard.valuationTooltip.buyback')
      case 'USER':
        return t('dashboard.valuationTooltip.user')
      case 'MIXED':
        return t('dashboard.valuationTooltip.mixed')
      case 'NONE':
        return t('dashboard.valuationTooltip.none')
      default:
        return null
    }
  }

  const tooltipText = getValuationTooltip()

  return (
    <Link
      href={ROUTES.BRAND_DETAIL(brandCode)}
      className="block outline-none group"
    >
      <div className="shrink-0 w-[280px] bg-surface-elevated border border-border rounded-xl p-4 shadow-sm transition-all group-hover:shadow-md group-hover:border-accent-gold/50 cursor-pointer relative overflow-hidden flex flex-col justify-between">
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300" />

        {/* Header: Brand Name + Weight */}
        <div className="flex justify-between items-start relative z-10 mb-2">
          <div className="flex items-center gap-1.5">
            <Typography as="h3" variant="h3" className="group-hover:text-accent-gold transition-colors">
              {brandName}
            </Typography>
            {tooltipText && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Typography variant="caption" className="text-muted-foreground font-medium text-xs">
            {isVisible ? formatWeight(totalGrams) : '••••'}
          </Typography>
        </div>

        {/* Bottom Section: Value & Chip */}
        <div className="relative z-10 flex flex-col gap-1">
          {/* Main Value */}
          <div>
            <Typography variant="caption" className="text-muted-foreground mb-0.5 block text-[10px] uppercase tracking-wider">
              {t('dashboard.brandCard.estimatedSellValue')}
            </Typography>
            <Typography variant="h2" className="financial-value text-xl">
              {isUnvalued
                ? t('dashboard.brandCard.priceNotAvailable')
                : isVisible ? formatCurrency(currentValue) : '••••••••'}
            </Typography>
          </div>

          {/* Daily Change - Compact Chip */}
          {!isUnvalued && deltaValue !== 0 && (
            <div
              className={cn(
                "flex items-center gap-1.5 w-fit px-2 py-1 rounded-md",
                isPositive ? "bg-emerald-500/10" : "bg-red-500/10"
              )}
            >
              <TrendingUp className={cn("w-3.5 h-3.5", !isPositive && "rotate-180 text-red-600", isPositive && "text-emerald-600")} />
              <div className="flex items-baseline gap-1">
                <Typography
                  variant="caption"
                  className={cn("font-semibold text-xs", isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}
                >
                  {isVisible ? (isPositive ? '+' : '') + formatCurrency(deltaValue) : '****'}
                </Typography>
                <Typography
                  variant="caption"
                  className={cn("font-medium text-[10px]", isPositive ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-red-600/80 dark:text-red-400/80")}
                >
                  {isVisible ? `(${deltaPercentage >= 0 ? '+' : ''}${deltaPercentage.toFixed(2)}%)` : '(****%)'}
                </Typography>
              </div>
            </div>
          )}

          {/* Empty state for unvalued */}
          {isUnvalued && (
            <Typography variant="caption" className="text-muted-foreground italic text-xs">
              {t('dashboard.valuationTooltip.none')}
            </Typography>
          )}
        </div>
      </div>
    </Link>
  )
}
