'use client'

import { ReactNode } from 'react'
import { PageHeader } from '@/frontend/components/ui/page-header'
import { PageWrapper, Container } from '@/frontend/components/ui/layout'

interface StandardPageLayoutProps {
  title?: string
  description?: string
  breadcrumbs: {
    label: string
    href?: string
  }[]
  children: ReactNode
  action?: ReactNode
}

export function StandardPageLayout({
  title,
  description,
  breadcrumbs,
  children,
  action,
}: StandardPageLayoutProps) {
  return (
    <Container className="py-8 flex flex-col min-w-0">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} action={action} />
      <div className="mt-6 flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </Container>
  )
}
