export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code: string | null = null,
    readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
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
