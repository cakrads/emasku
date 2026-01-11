/**
 * ChartRenderer - Chart Library Abstraction Layer
 * 
 * CRITICAL: This is the ONLY file that should import a chart library (Recharts).
 * All chart-specific code must be isolated here to allow easy library replacement.
 * 
 * Design Philosophy:
 * - Zero business logic
 * - Pure rendering component
 * - Generic data structure (array of objects with configurable keys)
 */

'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface ChartConfig {
  /** Color for the line */
  lineColor?: string
  /** Stroke width */
  strokeWidth?: number
  /** Show grid */
  showGrid?: boolean
  /** Show tooltip */
  showTooltip?: boolean
  /** Height in pixels */
  height?: number
}

export interface ChartRendererProps {
  /** Array of data objects */
  data: Array<Record<string, unknown>>
  /** Key for X-axis values */
  xKey: string
  /** Key for Y-axis values */
  yKey: string
  /** Optional configuration */
  config?: ChartConfig
  /** Optional custom tooltip formatter */
  tooltipFormatter?: (value: unknown) => string
  /** Optional custom X-axis formatter */
  xAxisFormatter?: (value: unknown) => string
  /** Optional custom Y-axis formatter */
  yAxisFormatter?: (value: unknown) => string
}

const DEFAULT_CONFIG: ChartConfig = {
  lineColor: '#D4AF37', // Gold accent
  strokeWidth: 2,
  showGrid: true,
  showTooltip: true,
  height: 300,
}

/**
 * ChartRenderer Component
 * 
 * Renders a line chart using Recharts.
 * To replace with another library, only modify this file.
 */
export function ChartRenderer({
  data,
  xKey,
  yKey,
  config = {},
  tooltipFormatter,
  xAxisFormatter,
  yAxisFormatter,
}: ChartRendererProps) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  return (
    <ResponsiveContainer width="100%" height={finalConfig.height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {finalConfig.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        )}

        <XAxis
          dataKey={xKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={xAxisFormatter}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={yAxisFormatter}
          tickLine={false}
          axisLine={false}
        />

        {finalConfig.showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
            formatter={tooltipFormatter}
          />
        )}

        <Line
          type="monotone"
          dataKey={yKey}
          stroke={finalConfig.lineColor}
          strokeWidth={finalConfig.strokeWidth}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
