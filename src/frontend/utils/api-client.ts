/**
 * API Client Utilities
 * 
 * Standardized fetch wrapper and error handling for the frontend.
 */

/**
 * Standard API Error
 * Parses backend error structure: { code, success, message, details }
 */
export class ApiError extends Error {
  public status: number
  public code: number | string
  public details?: Record<string, any>

  constructor(message: string, status: number, details?: Record<string, any>, code: number | string = status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  get description(): string {
    return this.details?.description || ''
  }
}

/**
 * Fetch JSON with standardized error handling
 */
export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // If response is not OK, try to parse error details
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      let errorDetails = undefined
      let errorCode: number | string = response.status

      try {
        const errorData = await response.json()

        // Backend format: { code, success, message, details }
        if (errorData) {
          errorMessage = errorData.message || errorMessage
          errorDetails = errorData.details
          if (errorData.code) errorCode = errorData.code
        }
      } catch (e) {
        // Fallback to text if JSON parsing fails
        // or keep default message
      }

      throw new ApiError(errorMessage, response.status, errorDetails, errorCode)
    }

    // Success - parse data
    // Backend format: { code, success, message, data, details }
    const json = await response.json()
    return json.data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network errors or other issues
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}
