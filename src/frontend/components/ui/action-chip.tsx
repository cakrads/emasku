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
}

type ActionChipLinkProps = SharedProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
  }

type ActionChipButtonProps = SharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

export type ActionChipProps = ActionChipLinkProps | ActionChipButtonProps

export function ActionChip(props: ActionChipProps) {
  const { icon, label, variant, className, href, ...rest } = props
  const chipClass = cn(actionChipVariants({ variant }), className)
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </>
  )

  if (href !== undefined) {
    return (
      <Link href={href} className={chipClass} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={chipClass} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
