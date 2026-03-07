import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/frontend/utils/cn"

const actionChipVariants = cva(
  "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-accent-gold text-accent-foreground hover:brightness-110",
        outline: "border border-border text-foreground bg-background hover:bg-surface",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export interface ActionChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionChipVariants> {
  icon?: React.ReactNode
  label: string
  href?: string
}

export function ActionChip({ icon, label, variant, className, href, ...props }: ActionChipProps) {
  const chipClass = cn(actionChipVariants({ variant }), className)
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={chipClass}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={chipClass} {...props}>
      {content}
    </button>
  )
}
