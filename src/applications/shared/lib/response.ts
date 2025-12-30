/**
 * Standardized API Response Wrapper
 * 
 * All API endpoints MUST use these helpers to ensure
 * consistent response structure as defined in api-contract.md
 */

import { NextResponse } from 'next/server'
import { BaseError } from './errors'

/**
 * Standard API response envelope
 */
interface ApiResponse<T = any> {
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
