'use client'

import { Stack } from '@/frontend/components/ui/layout'
import { Typography } from '@/frontend/components/ui/typography'
import { Button } from '@/frontend/components/ui/button'
import Link from 'next/link'
import { cn } from '@/frontend/utils/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  className,
}: EmptyStateProps) {
  return (
    <Stack
      gap="md"
      className={cn(
        "items-center justify-center text-center py-8 px-4",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      )}

      <Stack gap="xs" className="items-center max-w-md">
        <Typography variant="h4" className="text-foreground">
          {title}
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          {description}
        </Typography>
      </Stack>

      {(ctaLabel && ctaHref) && (
        <Stack gap="sm" className="items-center">
          <Button asChild color="primary">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="text-sm text-muted-foreground hover:text-accent-gold transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </Stack>
      )}
    </Stack>
  )
}
