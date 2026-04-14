'use client'

import { Typography } from '@/frontend/components/ui/typography'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/frontend/components/ui/tooltip'

interface PortfolioSummaryCardProps {
  totalValue: number
  totalBuyValue: number
  todayChange: number
  todayChangePercentage: number
  isLoading?: boolean
}

export default function PortfolioSummaryCard({
  totalValue,
  totalBuyValue,
  todayChange,
  todayChangePercentage,
  isLoading
}: PortfolioSummaryCardProps) {
  const { t, language } = useLanguage()
  const isPositive = todayChange >= 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value))
  }

  if (isLoading) {
    return (
      <div className="shrink-0 w-[230px] h-[110px] bg-(--surface-elevated) border border-(--border) rounded-xl px-4 py-3 flex flex-col">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-3 w-28 mb-auto" />
        <Skeleton className="h-4 w-36" />
      </div>
    )
  }

  const tooltipMessage = language === 'id'
    ? `${formatCurrency(totalValue)} merupakan estimasi nilai jual total portofolio berdasarkan harga pasar terkini`
    : `${formatCurrency(totalValue)} is the estimated total sell value of your portfolio based on current market prices`

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="shrink-0 w-[230px] h-[110px] bg-(--surface-elevated) border border-(--border) rounded-xl px-4 py-3 relative overflow-hidden group hover:border-accent-gold/50 transition-all cursor-default flex flex-col">
            <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300" />

            <div className="relative z-10 flex flex-col flex-1">
              {/* Row 1: Label */}
              <Typography variant="caption" className="text-2xs text-muted-foreground/70 font-medium mb-1 block">
                {t('dashboard.portfolioValue')}
              </Typography>

              {/* Row 2: Estimated Value */}
              <Typography className="text-lg font-bold financial-value leading-tight mb-1 block">
                {new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalValue)}
              </Typography>

              {/* Row 3: Total Buy Value */}
              <Typography variant="caption" className="text-2xs text-muted-foreground/60 mb-auto block">
                {t('holdings.totalBuyValue')}: {formatCurrency(totalBuyValue)}
              </Typography>

              {/* Row 4: PnL */}
              <div
                className={cn(
                  "flex items-center gap-1 text-xs mt-1",
                  todayChange > 0 ? "text-(--positive)" : todayChange < 0 ? "text-(--negative)" : "text-muted-foreground"
                )}
              >
                <TrendingUp className={cn("w-3 h-3 shrink-0", todayChange < 0 && "rotate-180", todayChange === 0 && "hidden")} />
                <span className="font-medium">
                  {todayChange > 0 ? '+' : ''}{formatCurrency(todayChange)} ({todayChangePercentage > 0 ? '+' : ''}{todayChangePercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[280px]">
          <p className="text-xs">{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
