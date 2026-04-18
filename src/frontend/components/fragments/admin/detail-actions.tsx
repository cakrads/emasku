import * as React from "react"
import { Button } from "@/frontend/components/ui/button"
import { cn } from "@/frontend/utils/cn"

interface Action {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "solid"
  color?: "default" | "primary" | "warning" | "error"
  disabled?: boolean
}

interface DetailActionsProps {
  actions: Action[]
  className?: string
}

export function DetailActions({ actions, className }: DetailActionsProps) {
  return (
    <footer className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4",
      "md:static md:border-0 md:bg-transparent md:p-0 md:pt-6 md:flex md:justify-end",
      className
    )}>
      <div className={cn(
        "grid gap-3",
        "md:flex md:flex-row-reverse md:gap-3",
        actions.length === 2 ? "grid-cols-2" : "grid-cols-1"
      )}>
        {actions.map((action, idx) => {
          let variant: "solid" | "outline" | "ghost" | "link" = "solid"
          let color: "default" | "primary" | "destructive" | "warning" | "subtle" = "default"

          switch (action.variant) {
            case "outline": variant = "outline"; break
            case "ghost": variant = "ghost"; break
            case "link": variant = "link"; break
            case "destructive": variant = "solid"; color = "destructive"; break
            case "secondary": variant = "solid"; color = "subtle"; break
            default: variant = "solid"; break
          }

          if (action.color) {
            if (action.color === "error") color = "destructive"
            else if (action.color === "warning") color = "warning"
            else if (action.color === "primary") color = "primary"
            else if (action.color === "default") color = "default"
          }

          return (
            <Button
              key={idx}
              variant={variant}
              color={color}
              onClick={action.onClick}
              disabled={action.disabled}
              size="lg"
              fullWidth
              className="md:w-auto"
            >
              {action.label}
            </Button>
          )
        })}
      </div>
    </footer>
  )
}
