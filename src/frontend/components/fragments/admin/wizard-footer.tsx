import * as React from "react"
import { Button } from "@/frontend/components/ui/button"
import { Container } from "@/frontend/components/ui/layout"
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
    <footer className={cn("fixed bottom-0 left-0 right-0 p-4 md:p-0 bg-background border-t border-border md:static md:border-0 md:bg-transparent", className)}>
      <Container className="p-0">
        <Button
          variant="solid"
          color="primary"
          className="w-full h-12 rounded-xl text-sm font-semibold"
          disabled={disabled}
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </Container>
    </footer>
  )
}
