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
    <header className={cn("px-6 pt-6 pb-2 sticky top-0 bg-background z-10", className)}>
      <Stack direction="horizontal" gap="md" className="items-center">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-3 h-10 w-10">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <Stack gap="none">
          <Typography as="h1" variant="h3">{title}</Typography>
          <Typography variant="caption">Step {currentStep} of {totalSteps}</Typography>
        </Stack>
      </Stack>
    </header>
  )
}
