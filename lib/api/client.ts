import { ApiError } from "./errors"
import type { ApiResponse } from "./types"

const BASE = "/api/v1"

export type QueryParams = Record<string, string | number | boolean | undefined | null>

function buildUrl(path: string, params?: QueryParams): string {
  if (!params) return BASE + path
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value))
  }
  const qs = search.toString()
  return BASE + path + (qs ? `?${qs}` : "")
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; params?: QueryParams } = {},
): Promise<T> {
  const res = await fetch(buildUrl(path, options.params), {
    method,
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin",
  })

  const json = (await res.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string; code?: string; errors?: Record<string, string[]> }
    | null

  if (!res.ok) {
    const err = json as { message?: string; code?: string; errors?: Record<string, string[]> } | null
    throw new ApiError(res.status, err?.message ?? "Request failed", err?.code ?? null, err?.errors)
  }

  return (json as ApiResponse<T>).data
}

export const api = {
  get: <T>(path: string, params?: QueryParams) => request<T>("GET", path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  del: <T>(path: string, body?: unknown) => request<T>("DELETE", path, { body }),
}
