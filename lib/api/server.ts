import "server-only"
import type { ApiResponse } from "./types"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

/** Server-side counterpart to the browser `client` — reads public API endpoints for SSR pages. */
export async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, { next: { revalidate: 120 } })
    if (!res.ok) return null
    const json = (await res.json()) as ApiResponse<T>
    return json.data ?? null
  } catch {
    return null
  }
}
