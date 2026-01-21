/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * Usage:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */

'use client'

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
} from '@/frontend/components/ui/empty'
import { Button } from '@/frontend/components/ui/button'
import React, { Component, ReactNode } from 'react'
import { ApiError } from '@/frontend/utils/api-client'
import { useLanguage } from '@/frontend/hooks/use-language'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Custom error handling for ApiError
      const isApiError = this.state.error instanceof ApiError
      const apiError = isApiError ? (this.state.error as ApiError) : null

      const title = apiError ? apiError.message : 'Something went wrong'
      const description = apiError?.description || (typeof apiError?.details?.originalError === 'string' ? apiError.details.originalError : JSON.stringify(apiError?.details?.originalError)) || 'An unexpected error occurred. Please try refreshing the page.'

      // Default fallback UI
      return (
        <ErrorUI
          error={this.state.error}
          apiError={apiError}
          onRefresh={() => window.location.reload()}
        />
      )
    }

    return this.props.children
  }
}

function ErrorUI({ error, apiError, onRefresh }: { error: Error | null, apiError: ApiError | null, onRefresh: () => void }) {
  const { t } = useLanguage()

  const title = apiError ? apiError.message : t('errorBoundary.title')
  const description = apiError?.description || (typeof apiError?.details?.originalError === 'string' ? apiError.details.originalError : JSON.stringify(apiError?.details?.originalError)) || t('errorBoundary.description')

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Empty>
        <EmptyMedia variant="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription className="whitespace-pre-line">
            {description}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onRefresh}>
            {t('errorBoundary.refresh')}
          </Button>
        </EmptyContent>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-muted p-4 rounded-lg text-sm mt-8 w-full max-w-lg">
            <summary className="cursor-pointer font-medium mb-2">
              {t('errorBoundary.devTitle')}
            </summary>
            <pre className="whitespace-pre-wrap wrap-break-word text-xs text-muted-foreground font-mono">
              {error.toString()}
              {apiError && apiError.details && `\n\nDetails:\n${JSON.stringify(apiError.details, null, 2)}`}
            </pre>
          </details>
        )}
      </Empty>
    </div>
  )
}
