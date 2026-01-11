'use client'

import { useEffect, useRef } from 'react'
import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Card } from '@/frontend/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface ChartDataPoint {
  date: string
  value: number
}

interface PortfolioChartProps {
  data: ChartDataPoint[]
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    if (data.length === 0) return

    // Calculate dimensions
    const padding = { top: 20, right: 10, bottom: 30, left: 10 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Find min and max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Draw line chart
    ctx.strokeStyle = '#D4AF37' // Muted gold
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = padding.top + chartHeight - normalizedValue * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.1)')
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')

    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw date labels
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.textAlign = 'center'

    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1]
    labelIndices.forEach(index => {
      const point = data[index]
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const date = new Date(point.date)
      const label = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      ctx.fillText(label, x, rect.height - 8)
    })
  }, [data])

  // Empty state
  if (data.length === 0) {
    return (
      <Stack gap="sm">
        <Stack gap="none">
          <Typography variant="h3">Performance</Typography>
          <Typography variant="body-sm">Last 7 days</Typography>
        </Stack>

        <Card className="p-4 bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
          <div
            className="w-full flex flex-col items-center justify-center text-center gap-3"
            style={{ height: '200px' }}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
            <Typography variant="body-sm" className="text-muted-foreground max-w-xs">
              Grafik pergerakan nilai akan muncul setelah kamu menambahkan emas
            </Typography>
          </div>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack gap="sm">
      <Stack gap="none">
        <Typography variant="h3">Performance</Typography>
        <Typography variant="body-sm">Last 7 days</Typography>
      </Stack>

      <Card className="p-4 bg-(--surface-elevated) border-(--border) shadow-(--shadow-sm)">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '200px' }}
        />
      </Card>
    </Stack>
  )
}
