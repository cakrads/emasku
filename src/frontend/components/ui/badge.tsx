import * as React from "react"
import { cn } from "@/frontend/utils/cn"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "destructive" | "warning" | "info"
}

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "text-foreground border border-input",
    success: "bg-[var(--positive-bg)] text-[var(--positive)]",
    destructive: "bg-[var(--negative-bg)] text-[var(--negative)]",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
