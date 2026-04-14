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

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

export interface ChartConfig {
  /** Type of chart: 'line' or 'area' (default: 'line') */
  chartType?: 'line' | 'area'
  /** Color for the line/area border */
  lineColor?: string
  /** Color for the area fill (if area chart) */
  fillColor?: string
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
  chartType: 'area', // Default to area for premium look
  lineColor: '#D4AF37', // Gold accent
  fillColor: '#D4AF37',
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
      <div className="bg-popover/95 backdrop-blur-sm border border-border px-4 py-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-muted-foreground text-2xs uppercase font-bold tracking-widest mb-1">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </p>
        <p className="font-bold text-lg text-foreground tracking-tight">
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
 * Renders a line or area chart using Recharts.
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
  const ChartComponent = finalConfig.chartType === 'area' ? AreaChart : AreaChart // Still AreaChart, just different rendering if needed

  return (
    <ResponsiveContainer width="100%" height={finalConfig.height}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={finalConfig.fillColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={finalConfig.fillColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {finalConfig.showGrid && (
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
        )}

        <XAxis
          dataKey={xKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickFormatter={xAxisFormatter}
          tickLine={false}
          axisLine={false}
          ticks={xAxisTicks}
          interval={0}
          dy={10}
        />

        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickFormatter={yAxisFormatter}
          tickLine={false}
          axisLine={false}
          dx={-10}
          domain={['auto', 'auto']} // Better scaling
        />

        {finalConfig.showTooltip && (
          <Tooltip
            content={<CustomTooltip labelFormatter={labelFormatter} formatter={tooltipFormatter} />}
            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1.5, strokeDasharray: '4 4' }}
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
              fontSize: 10,
              fontWeight: 'bold'
            }}
            strokeDasharray="3 3"
          />
        )}

        <Area
          type="monotone"
          dataKey={yKey}
          stroke={finalConfig.lineColor}
          strokeWidth={finalConfig.strokeWidth}
          fillOpacity={1}
          fill="url(#chartGradient)"
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-in-out"
          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: finalConfig.lineColor }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
