import * as React from "react"

import { cn } from "@/frontend/utils/cn"
import { Card } from "@/frontend/components/ui/card"
import { Typography } from "@/frontend/components/ui/typography"

export interface StatCardProps {
  label: string
  value: React.ReactNode
  trend?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, trend, className }: StatCardProps) {
  return (
    <Card variant="surface" className={cn("p-4", className)}>
      <Typography as="p" variant="caption" className="mb-1">{label}</Typography>
      <Typography as="p" variant="value">{value}</Typography>
      {trend && <div className="mt-1">{trend}</div>}
    </Card>
  )
}
