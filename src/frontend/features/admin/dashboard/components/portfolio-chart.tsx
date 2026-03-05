'use client'

import dynamic from 'next/dynamic'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Card } from '@/frontend/components/ui/card'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'
import { useLanguage } from '@/frontend/hooks/use-language'

const ChartRenderer = dynamic(
  () => import('@/frontend/components/ui/chart-renderer').then(mod => ({ default: mod.ChartRenderer })),
  { ssr: false, loading: () => <Skeleton className="w-full h-[200px]" /> }
)

interface ChartDataPoint {
  date: string
  value: number
}

interface PortfolioChartProps {
  data: ChartDataPoint[]
}

/**
 * Format IDR currency
 * Example: 1270000 → "Rp 1,270,000"
 */
function formatIDR(value: unknown): string {
  if (value === null || value === undefined) return '-'
  const num = Number(value)
  if (isNaN(num)) return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format date for display
 * Example: "2026-01-02" → "Jan 2"
 */
function formatDate(value: unknown, locale: string = 'en-US'): string {
  const dateString = String(value)
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  const { t, language } = useLanguage()
  const locale = language === 'id' ? 'id-ID' : 'en-US'

  // Empty state
  if (data.length === 0) {
    return (
      <Stack gap="sm">
        <Stack gap="none">
          <Typography variant="h3">{t('dashboard.performance')}</Typography>
          <Typography variant="body-sm">{t('dashboard.last7Days')}</Typography>
        </Stack>

        <Card className="p-4 bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
          <Stack
            gap="sm"
            className="w-full items-center justify-center text-center"
            style={{ height: '200px' }}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
            <Typography variant="body-sm" className="text-muted-foreground max-w-xs">
              {t('dashboard.chartEmpty')}
            </Typography>
          </Stack>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack gap="sm">
      <Stack gap="none">
        <Typography variant="h3">{t('dashboard.performance')}</Typography>
        <Typography variant="body-sm">{t('dashboard.last7Days')}</Typography>
      </Stack>

      <Card className="p-4 bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
        <ChartRenderer
          data={data as unknown as Array<Record<string, unknown>>}
          xKey="date"
          yKey="value"
          config={{
            height: 200,
            lineColor: '#D4AF37', // Gold accent
            strokeWidth: 2,
          }}
          xAxisFormatter={(value) => formatDate(value, locale)}
          yAxisFormatter={(value) => formatIDR(value).replace('Rp', '').trim()}
          labelFormatter={(value) => {
            const date = new Date(String(value))
            return new Intl.DateTimeFormat(locale, {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }).format(date)
          }}
          tooltipFormatter={(value) => formatIDR(value)}
        />
      </Card>
    </Stack>
  )
}
