import * as React from "react"

import { cn } from "@/frontend/utils/cn"
import { Typography } from "@/frontend/components/ui/typography"
import { Divider } from "@/frontend/components/ui/layout"

export interface ListRowProps {
  leading?: React.ReactNode
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  trailingSubtitle?: React.ReactNode
  onClick?: () => void
  showDivider?: boolean
  className?: string
}

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  trailingSubtitle,
  onClick,
  showDivider = true,
  className,
}: ListRowProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "flex items-center gap-3 py-3",
          onClick && "cursor-pointer hover:bg-surface-hover rounded-lg px-2 -mx-2 transition-colors"
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      >
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="flex-1 min-w-0">
          <Typography as="p" variant="body" className="truncate">{title}</Typography>
          {subtitle && (
            <Typography as="p" variant="caption">{subtitle}</Typography>
          )}
        </div>
        {(trailing || trailingSubtitle) && (
          <div className="shrink-0 text-right">
            {trailing && <div>{trailing}</div>}
            {trailingSubtitle && <div>{trailingSubtitle}</div>}
          </div>
        )}
      </div>
      {showDivider && <Divider />}
    </div>
  )
}
