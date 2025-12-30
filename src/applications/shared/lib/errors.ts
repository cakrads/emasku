/**
 * Centralized Error Hierarchy
 * 
 * Custom error classes that automatically map to HTTP status codes.
 * Controllers catch these typed errors and the response wrapper
 * converts them to standardized API responses.
 */

/**
 * Base error class with HTTP status code
 */
export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly details?: object
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    }
  }
}

/**
 * 400 - Client sent invalid data
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 400, details)
  }
}

/**
 * 404 - Resource not found
 */
export class NotFoundError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 404, details)
  }
}

/**
 * 409 - Conflict (e.g., duplicate entry)
 */
export class ConflictError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 409, details)
  }
}

/**
 * 401 - Authentication required
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 401, details)
  }
}

/**
 * 403 - Insufficient permissions
 */
export class ForbiddenError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 403, details)
  }
}

/**
 * 422 - Unprocessable entity (semantic validation failure)
 */
export class UnprocessableError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 422, details)
  }
}

/**
 * 500 - Internal server error
 */
export class InternalError extends BaseError {
  constructor(message: string, details?: object) {
    super(message, 500, details)
  }
}
