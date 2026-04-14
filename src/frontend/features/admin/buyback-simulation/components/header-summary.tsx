import { SimulationSummary } from '../hooks/use-buyback-simulation'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { Grid, Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'

interface HeaderSummaryProps {
  summary: SimulationSummary
  onReset: () => void
  onSell: () => void
}

export function HeaderSummary({ summary, onReset, onSell }: HeaderSummaryProps) {
  const { t } = useLanguage()

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const pnlSign = summary.totalPnL > 0 ? '+' : ''
  const pnlColor = summary.totalPnL > 0
    ? 'text-positive'
    : summary.totalPnL < 0
      ? 'text-negative'
      : 'text-muted-foreground'

  return (
    <Card className="mb-6 p-3 md:p-4 border-2 border-primary/10 shadow-lg bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Stack direction="horizontal" className="flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">

        {/* Selection Count */}
        <Stack direction="horizontal" className="items-center justify-between md:justify-start gap-4">
          <Typography as="div" variant="body-sm" className="font-medium text-muted-foreground">
            {t('buybackSimulation.headerSummary.selectedCount', { count: summary.selectedCount })}
          </Typography>
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
        </Stack>

        {/* Metrics Grid */}
        <Grid className="grid-cols-2 gap-3 w-full md:w-auto md:flex md:gap-10 md:items-end">

          {/* Est. Buyback Value */}
          <Stack className="text-left md:text-right md:order-3">
            <Typography as="div" variant="detail" className="text-2xs md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalBuyback')}
            </Typography>
            <Typography as="div" variant="body" className="text-2xl md:text-4xl font-extrabold text-accent-gold leading-none md:leading-tight">
              {formatIDR(summary.totalBuybackValue)}
            </Typography>
          </Stack>

          {/* Cost Basis */}
          <Stack className="text-right md:order-1">
            <Typography as="div" variant="detail" className="text-2xs md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalCost')}
            </Typography>
            <Typography as="div" variant="body" className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {formatIDR(summary.totalCostBasis)}
            </Typography>
          </Stack>

          {/* PnL */}
          <Stack className="text-left md:text-right col-span-2 md:col-span-1 pt-2 md:pt-0 border-t md:border-t-0 border-border/50 md:border-none md:order-2">
            <Typography as="div" variant="detail" className="text-2xs md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              {t('buybackSimulation.headerSummary.totalPnL')}
            </Typography>
            <Stack direction="horizontal" className="items-center justify-between md:justify-end gap-2">
              <Typography as="span" variant="body" className={cn(`text-base md:text-lg font-semibold leading-snug`, pnlColor)}>
                {pnlSign}{formatIDR(summary.totalPnL)}
              </Typography>
              <Typography as="span" variant="body-sm" className={cn(`text-xs md:text-sm font-medium opacity-80`, pnlColor)}>
                ({pnlSign}{summary.pnlPercentage.toFixed(2)}%)
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Stack>
    </Card>
  )
}
