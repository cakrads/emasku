import * as React from "react"
import { cn } from "@/frontend/utils/cn"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "caption" | "detail"
}

export function Typography({
  as: Component = "span",
  variant = "body",
  className,
  ...props
}: TypographyProps) {
  const variants = {
    h1: "text-2xl font-bold text-foreground",
    h2: "text-xl font-semibold text-foreground",
    h3: "text-lg font-semibold text-foreground",
    h4: "text-sm font-semibold uppercase tracking-wider text-text-secondary",
    body: "text-base text-foreground",
    "body-sm": "text-sm text-text-secondary",
    caption: "text-xs text-text-secondary",
    detail: "text-[10px] uppercase tracking-wide text-text-secondary",
  }

  return (
    <Component
      className={cn(variants[variant as keyof typeof variants], className)}
      {...props}
    />
  )
}
