'use client'

import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/frontend/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/frontend/components/ui/tooltip'
import { usePortfolioPrivacy } from '@/frontend/hooks/use-portfolio-privacy'
import { cn } from '@/frontend/utils/cn'

interface PrivacyToggleProps {
  className?: string
  iconClassName?: string
}

export function PrivacyToggle({ className, iconClassName }: PrivacyToggleProps) {
  const { isVisible, toggle } = usePortfolioPrivacy()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 text-muted-foreground hover:text-foreground", className)}
          onClick={toggle}
        >
          {isVisible ? (
            <Eye className={cn("h-4 w-4", iconClassName)} />
          ) : (
            <EyeOff className={cn("h-4 w-4", iconClassName)} />
          )}
          <span className="sr-only">
            {isVisible ? 'Hide values' : 'Show values'}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isVisible ? 'Hide values' : 'Show values'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
