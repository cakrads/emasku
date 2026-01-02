import * as React from "react"
import { cn } from "@/frontend/utils/cn"

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Container({ as: Component = "div", className, ...props }: LayoutProps) {
  return (
    <Component
      className={cn("w-full max-w-lg mx-auto px-6", className)}
      {...props}
    />
  )
}

export function PageWrapper({ className, ...props }: LayoutProps) {
  return (
    <div
      className={cn("min-h-screen bg-background flex justify-center", className)}
      {...props}
    />
  )
}

export function Stack({
  direction = "vertical",
  gap = "md",
  className,
  ...props
}: LayoutProps & { direction?: "vertical" | "horizontal"; gap?: "xs" | "sm" | "md" | "lg" | "xl" | "none" }) {
  const gaps = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  }

  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gaps[gap],
        className
      )}
      {...props}
    />
  )
}

export function Section({ as: Component = "section", className, ...props }: LayoutProps) {
  return (
    <Component
      className={cn("py-6", className)}
      {...props}
    />
  )
}

export function ScrollArea({ direction = "horizontal", className, ...props }: LayoutProps & { direction?: "horizontal" | "vertical" }) {
  return (
    <div
      className={cn(
        "hide-scrollbar",
        direction === "horizontal" ? "overflow-x-auto flex-row" : "overflow-y-auto flex-col",
        className
      )}
      {...props}
    />
  )
}

export function Divider({ className, direction = "horizontal" }: { className?: string; direction?: "horizontal" | "vertical" }) {
  return (
    <div
      className={cn(
        "bg-[var(--border)]",
        direction === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
    />
  )
}
