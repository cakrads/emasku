'use client'
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

interface BrandCardProps {
  brandCode: string
  brandName: string
  totalGrams: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'SPOT' | 'USER' | 'NONE' | 'MIXED'
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
      case 'SPOT':
        return t('dashboard.valuationTooltip.spot')
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
      <Stack
        gap="md"
        className="shrink-0 w-[280px] bg-(--surface-elevated) border border-(--border) rounded-xl p-4 shadow-(--shadow-sm) transition-all group-hover:shadow-(--shadow-md) group-hover:border-accent-gold/50 cursor-pointer relative overflow-hidden"
      >
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300" />

        {/* Header: Brand Name + Weight */}
        <Stack gap="xs" className="relative z-10">
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
          <Typography variant="caption" className="text-(--text-muted)">
            {formatWeight(totalGrams)}
          </Typography>
        </Stack>

        {/* Main Value Section */}
        <Stack gap="xs" className="relative z-10">
          <Typography variant="caption" className="text-(--text-muted)">
            {t('dashboard.brandCard.estimatedSellValue')}
          </Typography>
          <Typography variant="h2" className="financial-value">
            {isUnvalued ? t('dashboard.brandCard.priceNotAvailable') : formatCurrency(currentValue)}
          </Typography>
        </Stack>

        {/* Daily Change - Only show if valued */}
        {!isUnvalued && (
          <Stack
            direction="horizontal"
            gap="sm"
            className={cn(
              "items-center w-fit px-2 py-1 rounded-md",
              isPositive ? "bg-(--positive-bg)" : "bg-(--negative-bg)"
            )}
          >
            <TrendingUp className={cn("w-3 h-3", !isPositive && "rotate-180 text-(--negative)", isPositive && "text-(--positive)")} />
            <Stack direction="horizontal" gap="xs" className="items-center">
              <Typography
                variant="caption"
                className={cn("font-medium", isPositive ? "text-(--positive)" : "text-(--negative)")}
              >
                {t('dashboard.brandCard.todayChange')}:
              </Typography>
              <Typography
                variant="caption"
                className={cn("font-semibold", isPositive ? "text-(--positive)" : "text-(--negative)")}
              >
                {isPositive ? '+' : ''}{formatCurrency(deltaValue)}
              </Typography>
              <Typography
                variant="caption"
                className={cn("font-medium", isPositive ? "text-(--positive)" : "text-(--negative)")}
              >
                ({deltaPercentage >= 0 ? '+' : ''}{deltaPercentage.toFixed(2)}%)
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* Empty state for unvalued */}
        {isUnvalued && (
          <Typography variant="caption" className="text-(--text-muted) italic">
            {t('dashboard.valuationTooltip.none')}
          </Typography>
        )}
      </Stack>
    </Link>
  )
}
