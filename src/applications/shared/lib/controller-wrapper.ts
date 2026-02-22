/**
 * Controller Wrapper
 * 
 * Higher-order function that wraps controller handlers with:
 * - Automatic exception handling
 * - Request/response logging
 * - Trace ID generation
 * - Error mapping to HTTP responses
 * 
 * This eliminates boilerplate try/catch blocks and logging in every controller.
 */

import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { errorResponse } from './response'
import { logRequest, logError } from './logger'

/**
 * Creates a request handler that executes the given controller with automatic tracing, request/response logging, and error-to-HTTP response mapping.
 *
 * @param handler - Controller function that handles the incoming `NextRequest`. It receives an optional context `{ traceId }` and should produce a `NextResponse<T>` on success.
 * @returns A function that accepts a `NextRequest` and returns a `NextResponse`. On success the returned response will have an `X-Trace-Id` header; on error a standardized error response (with an HTTP status) is returned and the failure is logged with the same trace id.
 */
export function wrapController<T>(
  handler: (req: NextRequest, context?: { traceId: string }) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const traceId = randomUUID()
    const startTime = Date.now()
    const method = req.method
    const path = new URL(req.url).pathname

    try {
      // Execute the controller handler with trace context
      const response = await handler(req, { traceId })

      const duration = Date.now() - startTime
      const statusCode = response.status

      // Log successful request
      logRequest(method, path, statusCode, duration, { traceId })

      // Add trace ID to response headers for debugging
      response.headers.set('X-Trace-Id', traceId)

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      // Log error with full context
      logError('Controller error', error, {
        method,
        path,
        duration,
        traceId,
      })

      // Convert error to standardized API response
      const errorRes = errorResponse(error as Error, traceId)

      // Log failed request
      logRequest(method, path, errorRes.status, duration, {
        traceId,
        error: true
      })

      return errorRes
    }
  }
}