import * as React from "react"
import { Button } from "@/frontend/components/ui/button"
import { Container } from "@/frontend/components/ui/layout"
import { cn } from "@/frontend/utils/cn"

interface Action {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "solid" | "cta" | "glass"
  color?: "default" | "primary" | "warning" | "error"
  disabled?: boolean
}

interface DetailActionsProps {
  actions: Action[]
  className?: string
}

export function DetailActions({ actions, className }: DetailActionsProps) {
  return (
    <footer className={cn("fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 md:p-0 md:pt-4 md:static md:border-0 md:bg-transparent pb-4", className)}>
      <div className="w-full">
        <div className={cn("grid gap-3", actions.length === 2 ? "grid-cols-2" : "grid-cols-1")}>
          {actions.map((action, idx) => {
            // Map legacy props to new Button system
            let variant: "solid" | "outline" | "ghost" | "link" = "solid"
            let color: "default" | "primary" | "destructive" | "warning" | "subtle" = "default"

            // 1. Map Variant
            switch (action.variant) {
              case "outline": variant = "outline"; break
              case "ghost": variant = "ghost"; break
              case "link": variant = "link"; break
              case "destructive": variant = "solid"; color = "destructive"; break
              case "secondary": variant = "solid"; color = "subtle"; break
              default: variant = "solid"; break
            }

            // 2. Map Explicit Color (Override)
            if (action.color) {
              if (action.color === "error") color = "destructive"
              else if (action.color === "warning") color = "warning"
              else if (action.color === "primary") color = "primary"
            }

            return (
              <Button
                key={idx}
                variant={variant}
                color={color}
                onClick={action.onClick}
                disabled={action.disabled}
                size="lg"
                className="w-full h-12 text-sm font-semibold"
              >
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
