'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/frontend/components/ui/breadcrumb'
import { Typography } from '@/frontend/components/ui/typography'
import { ReactNode, Fragment } from 'react'

interface PageHeaderProps {
  title?: string
  description?: string
  breadcrumbs: {
    label: string
    href?: string
  }[]
  action?: ReactNode
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <Fragment key={crumb.label}>
                <BreadcrumbItem>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {(title || action) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {title && (
              <Typography variant="h2" className="text-3xl font-bold tracking-tight">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body" className="text-muted-foreground">
                {description}
              </Typography>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
    </div>
  )
}

