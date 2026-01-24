import * as React from "react"
import { Button } from "@/frontend/components/ui/button"
import { Container } from "@/frontend/components/ui/layout"
import { cn } from "@/frontend/utils/cn"

interface Action {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
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
      <Container className="p-0">
        <div className={cn("grid gap-3", actions.length === 2 ? "grid-cols-2" : "grid-cols-1")}>
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
              size="lg"
              className="w-full h-12 text-sm font-semibold"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </Container>
    </footer>
  )
}
