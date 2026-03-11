import * as React from "react"
import { ChevronLeft, CheckCircle2, Circle } from "lucide-react"
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
  stepLabels?: string[]
}

export function StepHeader({
  title,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  className,
  stepLabels,
}: StepHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 bg-background border-b border-border z-10 px-4 pt-4 pb-0",
      className
    )}>
      <Stack direction="horizontal" gap="sm" className="items-center mb-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 h-9 w-9" aria-label="Back">
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

      {/* Desktop: named step indicator (only when stepLabels provided) */}
      {stepLabels && stepLabels.length > 0 && (
        <Stack direction="horizontal" className="hidden md:flex items-center pb-3 gap-0">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1
            const isCompleted = stepNum < currentStep
            const isCurrent = stepNum === currentStep
            return (
              <React.Fragment key={i}>
                <Stack gap="xs" className="items-center shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-accent-gold" />
                  ) : (
                    <Circle className={cn("h-5 w-5", isCurrent ? "text-accent-gold fill-accent-gold" : "text-border")} />
                  )}
                  <Typography
                    variant="caption"
                    className={cn(
                      "leading-none whitespace-nowrap",
                      isCompleted && "text-text-secondary",
                      isCurrent && "text-accent-gold font-semibold",
                      !isCompleted && !isCurrent && "text-text-secondary opacity-50"
                    )}
                  >
                    {label}
                  </Typography>
                </Stack>
                {i < stepLabels.length - 1 && (
                  <Stack className={cn("h-px flex-1 mx-2 mt-[-10px]", i < currentStep - 1 ? "bg-accent-gold" : "bg-border")} />
                )}
              </React.Fragment>
            )
          })}
        </Stack>
      )}

      {/* Mobile: segmented progress bars */}
      <div className={cn("flex gap-1 pb-0", stepLabels && stepLabels.length > 0 ? "md:hidden" : "")}>
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
