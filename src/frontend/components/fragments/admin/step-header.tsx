import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"
import { Typography } from "@/frontend/components/ui/typography"
import { Stack } from "@/frontend/components/ui/layout"
import { cn } from "@/frontend/utils/cn"

interface StepHeaderProps {
  title: string
  currentStep: number
  totalSteps: number
  onBack: () => void
  showBack?: boolean
  className?: string
}

export function StepHeader({
  title,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  className,
}: StepHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 bg-background border-b border-border z-10 px-4 pt-4 pb-0",
      className
    )}>
      <Stack direction="horizontal" gap="sm" className="items-center mb-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <Stack gap="none" className="flex-1">
          <Typography as="h1" variant="h3">{title}</Typography>
          <Typography variant="caption">
            Step {currentStep} of {totalSteps}
          </Typography>
        </Stack>
      </Stack>

      {/* Segmented progress indicator */}
      <div className="flex gap-1 pb-0">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < currentStep ? "bg-accent-gold" : "bg-border"
            )}
          />
        ))}
      </div>
    </header>
  )
}
