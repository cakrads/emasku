/**
 * PriceHistoryChart - Business Logic Wrapper for Price Charts
 * 
 * This component handles:
 * - Date formatting (human-readable)
 * - IDR currency formatting
 * - Data transformation
 * 
 * It uses ChartRenderer internally for actual rendering.
 */

import { ChartRenderer } from '@/frontend/components/ui/chart-renderer'

export interface PriceHistoryChartProps {
  /** Array of price data points */
  data: Array<{ timestamp: string; price: number }>
  /** Optional chart height */
  height?: number
  /** Locale for date formatting */
  locale?: string
  /** Optional reference line configuration */
  referenceLine?: {
    x?: string | number
    label?: string
    stroke?: string
  }
}

/**
 * Format IDR currency
 * Example: 1270000 → "Rp 1,270,000"
 */
function formatIDR(value: unknown): string {
  const num = Number(value)
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
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * PriceHistoryChart Component
 * 
 * Displays a line chart of historical gold prices with proper formatting.
 */
export function PriceHistoryChart({ data, height = 300, locale = 'en-US', referenceLine }: PriceHistoryChartProps) {
  // Calculate specific ticks to limit X-axis labels (User req: ~7 labels)
  const ticks = (() => {
    if (data.length <= 7) return data.map(d => d.timestamp)

    const tickIndices = [0, 1, 2, 3, 4, 5, 6].map(i =>
      Math.floor(i * (data.length - 1) / 6)
    )
    // Remove duplicates if data is small but > 7
    const uniqueIndices = Array.from(new Set(tickIndices))
    return uniqueIndices.map(i => data[i].timestamp)
  })()

  return (
    <ChartRenderer
      data={data}
      xKey="timestamp"
      yKey="price"
      config={{
        height,
        lineColor: '#D4AF37', // Gold accent
        strokeWidth: 2,
        referenceLine,
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
      xAxisTicks={ticks}
    />
  )
}
