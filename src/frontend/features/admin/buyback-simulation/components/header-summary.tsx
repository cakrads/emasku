import { SimulationSummary } from '../hooks/use-buyback-simulation'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { RotateCcw } from 'lucide-react'

interface HeaderSummaryProps {
  summary: SimulationSummary
  onReset: () => void
  onSell: () => void
}

export function HeaderSummary({ summary, onReset, onSell }: HeaderSummaryProps) {
  const { t } = useLanguage()

  // Format IDR helper
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format PnL sign
  const pnlSign = summary.totalPnL > 0 ? '+' : ''
  const pnlColor = summary.totalPnL > 0
    ? 'text-green-600 dark:text-green-400'
    : summary.totalPnL < 0
      ? 'text-red-600 dark:text-red-400'
      : 'text-muted-foreground'

  return (
    <Card className="mb-6 p-3 md:p-4 border-2 border-primary/10 shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">

        {/* Selection Count */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="text-sm font-medium text-muted-foreground">
            {t('buybackSimulation.headerSummary.selectedCount', { count: summary.selectedCount })}
          </div>
          {summary.selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              {t('buybackSimulation.headerSummary.resetSelection')}
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:gap-10 md:items-end">

          {/* Est. Buyback Value */}
          <div className="text-left md:text-right md:order-3">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalBuyback')}
            </div>
            <div className="text-2xl md:text-4xl font-extrabold text-amber-500 dark:text-amber-400 leading-none md:leading-tight">
              {formatIDR(summary.totalBuybackValue)}
            </div>
          </div>

          {/* Cost Basis */}
          <div className="text-right md:order-1">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalCost')}
            </div>
            <div className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {formatIDR(summary.totalCostBasis)}
            </div>
          </div>

          {/* PnL */}
          <div className="text-left md:text-right col-span-2 md:col-span-1 pt-2 md:pt-0 border-t md:border-t-0 border-border/50 md:border-none flex flex-row md:block items-center justify-between md:order-2">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5 md:mb-0.5">
              {t('buybackSimulation.headerSummary.totalPnL')}
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className={`text-base md:text-lg font-semibold leading-snug ${pnlColor}`}>
                {pnlSign}{formatIDR(summary.totalPnL)}
              </span>
              <span className={`text-xs md:text-sm font-medium opacity-80 ${pnlColor}`}>
                ({pnlSign}{summary.pnlPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card >
  )
}

