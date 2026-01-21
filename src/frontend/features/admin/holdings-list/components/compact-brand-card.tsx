'use client'

import Link from 'next/link'
import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/frontend/components/ui/tooltip'

interface CompactBrandCardProps {
  brandCode: string
  brandName: string
  totalGrams: number
  totalBuyValue: number
  currentValue: number
  deltaValue: number
  deltaPercentage: number
  valuationSource: 'BUYBACK' | 'SPOT' | 'USER' | 'NONE' | 'MIXED'
}

export default function CompactBrandCard({
  brandCode,
  brandName,
  totalGrams,
  totalBuyValue,
  currentValue,
  deltaValue,
  deltaPercentage,
  valuationSource,
}: CompactBrandCardProps) {
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

  const formatWeight = (grams: number) => `${new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grams || 0)}g`

  const getValuationLabel = () => {
    switch (valuationSource) {
      case 'BUYBACK':
        return language === 'id' ? 'harga buyback' : 'buyback price'
      case 'SPOT':
        return language === 'id' ? 'harga spot' : 'spot price'
      case 'USER':
        return language === 'id' ? 'harga manual' : 'manual price'
      case 'MIXED':
        return language === 'id' ? 'harga campuran' : 'mixed price'
      default:
        return null
    }
  }

  const valuationLabel = getValuationLabel()
  const tooltipMessage = valuationLabel
    ? `${formatCurrency(currentValue)} ${language === 'id' ? 'merupakan estimasi harga jual berdasarkan' : 'is an estimated sell price based on'} ${valuationLabel} ${brandName}`
    : t('dashboard.valuationTooltip.none')

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={ROUTES.BRAND_DETAIL(brandCode)}
            className="block outline-none group shrink-0"
          >
            {/* Fixed height card for consistency */}
            <div className="w-[230px] h-[110px] bg-(--surface-elevated) border border-(--border) rounded-xl px-4 py-3 relative overflow-hidden hover:border-accent-gold/50 transition-all flex flex-col">
              <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300" />

              <div className="relative z-10 flex flex-col flex-1">
                {/* Row 1: Brand + Weight */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Typography className="text-sm font-semibold group-hover:text-accent-gold transition-colors truncate">
                    {brandName}
                  </Typography>
                  <span className="text-xs text-muted-foreground/60 shrink-0">
                    {formatWeight(totalGrams)}
                  </span>
                </div>

                {/* Row 2: Estimate Value */}
                <Typography className="text-lg font-bold financial-value leading-tight mb-1">
                  {isUnvalued ? '—' : formatCurrency(currentValue)}
                </Typography>

                {/* Row 3: Total Buy Value */}
                <Typography variant="caption" className="text-[11px] text-muted-foreground/60 mb-auto">
                  {t('holdings.totalBuyValue')}: {formatCurrency(totalBuyValue)}
                </Typography>

                {/* Row 4: PnL - Always show row to maintain height */}
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs mt-1",
                    isUnvalued ? "invisible" : "",
                    deltaValue > 0 ? "text-(--positive)" : deltaValue < 0 ? "text-(--negative)" : "text-muted-foreground"
                  )}
                >
                  <TrendingUp className={cn("w-3 h-3 shrink-0", deltaValue < 0 && "rotate-180", deltaValue === 0 && "hidden")} />
                  <span className="font-medium">
                    {deltaValue > 0 ? '+' : ''}{formatCurrency(deltaValue)} ({deltaPercentage > 0 ? '+' : ''}{deltaPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[250px]">
          <p className="text-xs">{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
