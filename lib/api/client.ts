import { ApiError } from "./errors"
import type { ApiResponse } from "./types"

const BASE = "/api/v1"

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

function buildUrl(path: string, params?: QueryParams): string {
  if (!params) return BASE + path
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "")
      search.set(key, String(value))
  }
  const qs = search.toString()
  return BASE + path + (qs ? `?${qs}` : "")
}

type ErrorBody = {
  message?: string
  code?: string
  errors?: Record<string, string[]>
}

async function parse<T>(res: Response, fallback: string): Promise<T> {
  const json = (await res.json().catch(() => null)) as
    ApiResponse<T> | ErrorBody | null

  if (!res.ok) {
    const err = json as ErrorBody | null
    throw new ApiError(
      res.status,
      err?.message ?? fallback,
      err?.code ?? null,
      err?.errors
    )
  }

  return (json as ApiResponse<T>).data
}

async function request<T>(
  method: Method,
  path: string,
  options: { body?: unknown; params?: QueryParams } = {}
): Promise<T> {
  let res: Response
  try {
    res = await fetch(buildUrl(path, options.params), {
      method,
      headers:
        options.body !== undefined
          ? { "Content-Type": "application/json" }
          : undefined,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: "same-origin",
    })
  } catch {
    throw ApiError.network()
  }

  return parse<T>(res, "Request failed")
}

async function upload<T>(
  method: Method,
  path: string,
  form: FormData
): Promise<T> {
  let res: Response
  try {
    res = await fetch(buildUrl(path), {
      method,
      body: form,
      credentials: "same-origin",
    })
  } catch {
    throw ApiError.network()
  }

  return parse<T>(res, "Upload failed")
}

export const api = {
  get: <T>(path: string, params?: QueryParams) =>
    request<T>("GET", path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>("PATCH", path, { body }),
  del: <T>(path: string, body?: unknown) =>
    request<T>("DELETE", path, { body }),
  upload: <T>(path: string, form: FormData) => upload<T>("POST", path, form),
  uploadPut: <T>(path: string, form: FormData) => upload<T>("PUT", path, form),
  uploadPatch: <T>(path: string, form: FormData) =>
    upload<T>("PATCH", path, form),
}
