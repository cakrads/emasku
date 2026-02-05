import { SimulationSummary } from '../hooks/use-buyback-simulation'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { RotateCcw } from 'lucide-react'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'

interface HeaderSummaryProps {
  summary: SimulationSummary
  onReset: () => void
}

export function HeaderSummary({ summary, onReset }: HeaderSummaryProps) {
  const { t } = useLanguage()
  const { isVisible } = usePortfolioPrivacy()

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
    <Card className="sticky top-2 md:top-16 z-30 mb-6 p-3 md:p-4 border-2 border-primary/10 shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex md:gap-8 md:items-end">

          {/* Est. Buyback Value */}
          <div className="text-left md:text-right md:order-3">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalBuyback')}
            </div>
            <div className="text-xl md:text-4xl font-extrabold text-amber-500 dark:text-amber-400 leading-none md:leading-tight">
              {isVisible ? formatIDR(summary.totalBuybackValue) : '••••••••'}
            </div>
          </div>

          {/* Remaining Value */}
          <div className="text-right md:order-4">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.remainingValue') || 'Remaining Value'}
            </div>
            <div className="text-lg md:text-2xl font-bold text-foreground leading-none md:leading-tight">
              {isVisible ? formatIDR(summary.remainingValue) : '••••••••'}
            </div>
          </div>

          {/* Cost Basis */}
          <div className="text-left md:text-right md:order-1">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalCost')}
            </div>
            <div className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {isVisible ? formatIDR(summary.totalCostBasis) : '••••••••'}
            </div>
          </div>

          {/* PnL */}
          <div className="text-right md:order-2">
            <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalPnL')}
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center justify-end gap-0 md:gap-2">
              <span className={`text-base md:text-lg font-semibold leading-snug ${pnlColor}`}>
                {isVisible ? `${pnlSign}${formatIDR(summary.totalPnL)}` : '****'}
              </span>
              <span className={`text-xs md:text-sm font-medium opacity-80 ${pnlColor}`}>
                {isVisible ? `(${pnlSign}${summary.pnlPercentage.toFixed(2)}%)` : '(****%)'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Card>
  )
}

