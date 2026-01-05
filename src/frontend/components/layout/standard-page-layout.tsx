'use client'

import { ReactNode } from 'react'
import { PageHeader } from '@/frontend/components/ui/page-header'
import { PageWrapper, Container } from '@/frontend/components/ui/layout'

interface StandardPageLayoutProps {
  title: string
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
    <PageWrapper>
      <Container className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} action={action} />
        <div className="mt-6">
          {children}
        </div>
      </Container>
    </PageWrapper>
  )
}
