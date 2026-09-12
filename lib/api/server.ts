import "server-only"
import type { ApiResponse } from "./types"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

/** Tags let a change on the backend drop these at once; see `app/api/revalidate`. */
export async function serverGet<T>(
  path: string,
  tags: string[] = []
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      next: { revalidate: 120, tags },
    })
    if (!res.ok) return null
    const json = (await res.json()) as ApiResponse<T>
    return json.data ?? null
  } catch {
    return null
  }
}
