import "server-only"
import { unstable_cache } from "next/cache"
import type { ApiResponse } from "./types"

const API_URL = process.env.SNACC_API_URL ?? "http://localhost:3000"

async function load<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}/api/v1${path}`, { cache: "no-store" })
  if (res.status === 429 || res.status >= 500) {
    throw new Error(`GET ${path} answered ${res.status}`)
  }
  if (!res.ok) return null

  const json = (await res.json()) as ApiResponse<T>
  return json.data ?? null
}

/**
 * A public read, shared by every visitor for two minutes. A page that's gone is cached as null
 * too, so a deleted snacc stops showing once its copy expires; a busy or failing backend throws
 * instead, which keeps the last good copy rather than turning a real page into a 404. Tags let a
 * change on the backend drop these at once; see `app/api/revalidate`.
 */
export function serverGet<T>(
  path: string,
  tags: string[] = []
): Promise<T | null> {
  return unstable_cache(() => load<T>(path), ["api", path], {
    revalidate: 120,
    tags,
  })()
}
