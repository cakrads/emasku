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
/**
 * Base error class with HTTP status code
 */
export class BaseError extends Error {
  public readonly title: string
  public readonly description: string

  constructor(
    message: string,
    public readonly code: number,
    public readonly details?: object,
    description?: string,
    title?: string
  ) {
    super(message)
    this.name = this.constructor.name
    this.title = title || message
    this.description = description || ''
    Error.captureStackTrace(this, this.constructor)

    // Ensure details object exists and contains standard fields
    this.details = {
      ...details,
      title: this.title,
      description: this.description,
    }
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
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 400, details, description, title)
  }
}

/**
 * 404 - Resource not found
 */
export class NotFoundError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 404, details, description, title)
  }
}

/**
 * 409 - Conflict (e.g., duplicate entry)
 */
export class ConflictError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 409, details, description, title)
  }
}

/**
 * 401 - Authentication required
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 401, details, description, title)
  }
}

/**
 * 403 - Insufficient permissions
 */
export class ForbiddenError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 403, details, description, title)
  }
}

/**
 * 422 - Unprocessable entity (semantic validation failure)
 */
export class UnprocessableError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 422, details, description, title)
  }
}

/**
 * 500 - Internal server error
 */
export class InternalError extends BaseError {
  constructor(message: string, details?: object, description?: string, title?: string) {
    super(message, 500, details, description, title)
  }
}
