import { SimulationSummary } from '../hooks/use-buyback-simulation'
import { useLanguage } from '@/frontend/hooks/use-language'
import { Button } from '@/frontend/components/ui/button'
import { Card } from '@/frontend/components/ui/card'
import { Grid, Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/frontend/utils/cn'
import { formatCurrency } from '@/frontend/utils/format'

interface HeaderSummaryProps {
  summary: SimulationSummary
  onReset: () => void
  onSell: () => void
}

export function HeaderSummary({ summary, onReset, onSell }: HeaderSummaryProps) {
  const { t } = useLanguage()

  const pnlSign = summary.totalPnL > 0 ? '+' : ''
  const pnlColor = summary.totalPnL > 0
    ? 'text-positive'
    : summary.totalPnL < 0
      ? 'text-negative'
      : 'text-muted-foreground'

  return (
    <Card className="mb-6 border border-border shadow-sm">
      <Grid className="grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-border md:divide-none">

        {/* Col 1: Selection state */}
        <Stack gap="xs" className="px-5 py-4 justify-center">
          <Typography as="div" variant="detail" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('buybackSimulation.headerSummary.selectedCount', { count: summary.selectedCount })}
          </Typography>
          {summary.selectedCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-0 text-xs text-muted-foreground hover:text-foreground justify-start w-fit"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              {t('buybackSimulation.headerSummary.resetSelection')}
            </Button>
          ) : (
            <Typography as="div" variant="body-sm" className="text-muted-foreground/50 text-xs">
              —
            </Typography>
          )}
        </Stack>

        {/* Col 2: Modal */}
        <Stack gap="xs" className="px-5 py-4 justify-center relative before:hidden md:before:block before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-border overflow-hidden">
          <Typography as="div" variant="detail" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('buybackSimulation.headerSummary.totalCost')}
          </Typography>
          <Typography as="div" variant="body" className="text-base font-semibold text-foreground leading-tight truncate">
            {formatCurrency(summary.totalCostBasis)}
          </Typography>
        </Stack>

        {/* Col 3: Untung/Rugi */}
        <Stack gap="xs" className="px-5 py-4 justify-center relative before:hidden md:before:block before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-border overflow-hidden">
          <Typography as="div" variant="detail" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('buybackSimulation.headerSummary.totalPnL')}
          </Typography>
          <Stack gap="none">
            <Typography as="span" variant="body" className={cn("text-base font-semibold leading-tight truncate", pnlColor)}>
              {pnlSign}{formatCurrency(summary.totalPnL)}
            </Typography>
            <Typography as="span" variant="caption" className={cn("text-xs font-medium opacity-80", pnlColor)}>
              ({pnlSign}{summary.pnlPercentage.toFixed(2)}%)
            </Typography>
          </Stack>
        </Stack>

        {/* Col 4: Est. Nilai Jual */}
        <Stack gap="xs" className="px-5 py-4 justify-center relative before:hidden md:before:block before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-border overflow-hidden">
          <Typography as="div" variant="detail" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('buybackSimulation.headerSummary.totalBuyback')}
          </Typography>
          <Typography as="div" variant="body" className="text-base font-bold text-accent-gold leading-tight truncate">
            {formatCurrency(summary.totalBuybackValue)}
          </Typography>
        </Stack>

      </Grid>
    </Card>
  )
}
