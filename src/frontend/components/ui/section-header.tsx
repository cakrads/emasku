import * as React from "react"

import { cn } from "@/frontend/utils/cn"
import { Typography } from "@/frontend/components/ui/typography"

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  href?: string
  className?: string
}

export function SectionHeader({ title, actionLabel, onAction, href, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Typography as="h2" variant="h3">{title}</Typography>
      {actionLabel && (href || onAction) && (
        href ? (
          <a
            href={href}
            className="text-sm font-medium text-accent-gold hover:underline"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-medium text-accent-gold hover:underline cursor-pointer"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  )
}
