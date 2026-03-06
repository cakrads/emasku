import * as React from "react"
import { Button } from "@/frontend/components/ui/button"
import { cn } from "@/frontend/utils/cn"

interface WizardFooterProps {
  onNext: () => void
  nextLabel: string
  disabled?: boolean
  className?: string
}

export function WizardFooter({
  onNext,
  nextLabel,
  disabled = false,
  className,
}: WizardFooterProps) {
  return (
    <footer className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4",
      "md:static md:border-0 md:bg-transparent md:pt-6",
      className
    )}>
      <Button
        variant="solid"
        color="primary"
        size="lg"
        rounded="xl"
        fullWidth
        disabled={disabled}
        onClick={onNext}
      >
        {nextLabel}
      </Button>
    </footer>
  )
}
