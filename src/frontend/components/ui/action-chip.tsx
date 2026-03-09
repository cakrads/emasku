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

type SharedProps = VariantProps<typeof actionChipVariants> & {
  icon?: React.ReactNode
  label: string
  className?: string
  disabled?: boolean
}

type ActionChipLinkProps = SharedProps &
  React.ComponentProps<typeof Link>

type ActionChipButtonProps = SharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

export type ActionChipProps = ActionChipLinkProps | ActionChipButtonProps

export function ActionChip(props: ActionChipProps) {
  const { icon, label, variant, className, href, disabled, ...rest } = props
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  )

  if (href !== undefined) {
    const linkClass = cn(
      actionChipVariants({ variant }),
      className,
      disabled && 'pointer-events-none opacity-50'
    )
    return (
      <Link
        href={href}
        className={linkClass}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...(rest as React.ComponentProps<typeof Link>)}
      >
        {content}
      </Link>
    )
  }

  const chipClass = cn(actionChipVariants({ variant }), className)
  return (
    <button type="button" disabled={disabled} className={chipClass} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
