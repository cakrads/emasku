import * as React from "react"
import { Typography } from "@/frontend/components/ui/typography"
import { Stack, Section } from "@/frontend/components/ui/layout"
import { cn } from "@/frontend/utils/cn"

interface DetailHeaderProps {
  badgeLabel?: string
  badgeColor?: string
  title: string
  subtitle: string
  value: string
  valueLabel: string
  className?: string
}

export function DetailHeader({
  badgeLabel,
  badgeColor,
  title,
  subtitle,
  value,
  valueLabel,
  className,
}: DetailHeaderProps) {
  return (
    <Section as="header" className={cn("px-6 pt-8 pb-6", className)}>
      <Stack direction="horizontal" className="justify-between items-start mb-2">
        <Stack gap="xs">
          {badgeLabel && (
            <span className={cn("inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1", badgeColor)}>
              {badgeLabel}
            </span>
          )}
          <Typography as="h1" variant="h1">{title}</Typography>
          <Typography variant="body-sm">{subtitle}</Typography>
        </Stack>
        <Stack gap="none" className="text-right">
          <Typography variant="h2" className="financial-value tabular-nums">{value}</Typography>
          <Typography variant="detail">{valueLabel}</Typography>
        </Stack>
      </Stack>
      <div className="h-px bg-border w-full mt-4" />
    </Section>
  )
}
