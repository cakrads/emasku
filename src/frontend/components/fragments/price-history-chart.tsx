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

import { ChartRenderer } from '../ui/chart-renderer'

export interface PriceHistoryChartProps {
  /** Array of price data points */
  data: Array<{ timestamp: string; price: number }>
  /** Optional chart height */
  height?: number
}

/**
 * Format IDR currency
 * Example: 1270000 → "Rp 1,270,000"
 */
function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date for display
 * Example: "2026-01-02" → "Jan 2"
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * PriceHistoryChart Component
 * 
 * Displays a line chart of historical gold prices with proper formatting.
 */
export function PriceHistoryChart({ data, height = 300 }: PriceHistoryChartProps) {
  return (
    <ChartRenderer
      data={data}
      xKey="timestamp"
      yKey="price"
      config={{
        height,
        lineColor: '#D4AF37', // Gold accent
        strokeWidth: 2,
      }}
      xAxisFormatter={formatDate}
      yAxisFormatter={(value) => formatIDR(value).replace('Rp', '').trim()}
      tooltipFormatter={(value) => formatIDR(value)}
    />
  )
}
