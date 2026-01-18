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

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

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
  /** Optional reference line configuration */
  referenceLine?: {
    x?: string | number
    label?: string
    stroke?: string
  }
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
  /** Optional custom tooltip label formatter (X-axis) */
  labelFormatter?: (label: unknown) => string
  /** Optional custom X-axis formatter */
  xAxisFormatter?: (value: unknown) => string
  /** Optional custom Y-axis formatter */
  yAxisFormatter?: (value: unknown) => string
  /** Optional custom X-axis ticks */
  xAxisTicks?: any[]
}

const DEFAULT_CONFIG: ChartConfig = {
  lineColor: '#D4AF37', // Gold accent
  strokeWidth: 2,
  showGrid: true,
  showTooltip: true,
  height: 300,
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number | string, name: string, color: string, dataKey: string }>
  label?: string | number
  labelFormatter?: (label: unknown) => string
  formatter?: (value: unknown) => string
}

function CustomTooltip({ active, payload, label, labelFormatter, formatter }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border px-3 py-2 rounded-lg shadow-sm">
        <p className="text-muted-foreground text-xs mb-1">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </p>
        <p className="font-medium text-foreground">
          {formatter ? formatter(payload[0].value) : String(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
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
  labelFormatter,
  xAxisFormatter,
  yAxisFormatter,
  xAxisTicks,
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
          ticks={xAxisTicks}
          interval={0} // Force show all passed ticks
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
            content={<CustomTooltip labelFormatter={labelFormatter} formatter={tooltipFormatter} />}
            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
        )}

        {finalConfig.referenceLine && (
          <ReferenceLine
            x={finalConfig.referenceLine.x}
            stroke={finalConfig.referenceLine.stroke || "hsl(var(--primary))"}
            label={{
              value: finalConfig.referenceLine.label,
              position: 'insideTopRight',
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12
            }}
            strokeDasharray="3 3"
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
