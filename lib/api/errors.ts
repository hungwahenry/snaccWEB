export const NETWORK_ERROR_MESSAGE =
  "Could not reach Snacc. Check your connection and try again."

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code: string | null = null,
    readonly errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }

  static network(): ApiError {
    return new ApiError(0, NETWORK_ERROR_MESSAGE, "network_error")
  }

  get firstFieldError(): string | null {
    const first = this.errors && Object.values(this.errors)[0]
    return first?.[0] ?? null
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.firstFieldError ?? error.message
  if (error instanceof Error) return error.message
  return "Something went wrong."
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isNotFound(error: unknown): boolean {
  return isApiError(error) && error.status === 404
}

export function isUnauthenticated(error: unknown): boolean {
  return isApiError(error) && error.status === 401
}
