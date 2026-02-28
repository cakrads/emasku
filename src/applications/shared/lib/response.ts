/**
 * Standardized API Response Wrapper
 * 
 * All API endpoints MUST use these helpers to ensure
 * consistent response structure as defined in api-contract.md
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { BaseError } from './errors'
import { logger } from './logger'

/**
 * Standard API response envelope
 */
interface ApiResponse<T = unknown> {
  code: number
  success: boolean
  message: string
  data: T | null
  details?: object
}

/**
 * 200 OK - Standard success response
 */
export function successResponse<T>(
  data: T,
  message: string = 'Request successful',
  details?: object
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      code: 200,
      success: true,
      message,
      data,
      details,
    },
    { status: 200 }
  )
}

/**
 * 201 Created - Resource creation success
 */
export function createdResponse<T>(
  data: T,
  message: string = 'Resource created successfully',
  details?: object
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      code: 201,
      success: true,
      message,
      data,
      details,
    },
    { status: 201 }
  )
}

/**
 * Error response from BaseError or generic Error
 */
export function errorResponse(
  error: BaseError | Error,
  traceId?: string
): NextResponse<ApiResponse<null>> {
  // Handle custom BaseError with known status codes
  if (error instanceof BaseError) {
    logger.warn('BaseError', {
      errorType: error.name,
      traceId,
      ...(process.env.NODE_ENV === 'development' ? { details: error.details } : {}),
    })
    return NextResponse.json(
      {
        code: error.code,
        success: false,
        message: error.message,
        data: null,
        details: {
          errorType: error.name,
          traceId,
          ...(error.details || {}),
        },
      },
      { status: error.code }
    )
  }

  // Handle Zod Validation Errors
  // In production, hide schema details to prevent leaking internal structure
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        code: 500, // Response validation failure is an internal error
        success: false,
        message: 'Data Integrity Error: Response validation failed',
        data: null,
        details: {
          errorType: 'ValidationSchemaError',
          traceId,
          ...(process.env.NODE_ENV === 'development' && {
            issues: error.issues,
          }),
        },
      },
      { status: 500 }
    )
  }

  // Handle generic unknown errors as 500
  return NextResponse.json(
    {
      code: 500,
      success: false,
      message: 'Internal server error',
      data: null,
      details: {
        errorType: 'InternalError',
        traceId,
        // In production, don't leak error details
        ...(process.env.NODE_ENV === 'development' && {
          originalError: error.message,
        }),
      },
    },
    { status: 500 }
  )
}
