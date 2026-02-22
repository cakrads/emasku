/**
 * Standardized API Response Wrapper
 * 
 * All API endpoints MUST use these helpers to ensure
 * consistent response structure as defined in api-contract.md
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { BaseError } from './errors'

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
 * Builds a standard 200 OK API response envelope.
 *
 * @param data - The payload to return in the response `data` field
 * @param message - Human-readable message for the response; defaults to 'Request successful'
 * @param details - Optional additional metadata to include in the response `details` field
 * @returns A NextResponse containing an ApiResponse with code 200, success `true`, the provided `message`, `data`, and any `details`
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
 * Create a standardized 201 Created API response envelope for a successful resource creation.
 *
 * @param data - The response payload to include in the `data` field
 * @param message - Optional message describing the result (default: 'Resource created successfully')
 * @param details - Optional additional metadata to include in the `details` field
 * @returns A NextResponse containing an ApiResponse with `code` 201, `success` true, the provided `message` and `data`, and optional `details`
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
 * Builds a standardized API error response from a BaseError, ZodError, or generic Error.
 *
 * For a BaseError, uses the error's HTTP code and message and includes any `error.details` in `details`.
 * For a ZodError, returns a 500 with message "Data Integrity Error: Response validation failed" and includes validation `issues`.
 * For any other Error, returns a 500 "Internal server error" and, in development, includes `originalError` with the error message.
 *
 * @param error - The error to convert into an API response.
 * @param traceId - Optional trace identifier to include in the response `details`.
 * @returns A NextResponse containing an ApiResponse with `success: false`, `data: null`, a numeric `code`, a human-readable `message`, and a `details` object that always includes `errorType` and `traceId` and may include additional fields (e.g., `issues`, `originalError`, or error-specific details).
 */
export function errorResponse(
  error: BaseError | Error,
  traceId?: string
): NextResponse<ApiResponse<null>> {
  // Handle custom BaseError with known status codes
  if (error instanceof BaseError) {
    console.log('BaseError details:', error.details)
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
          issues: error.issues,
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