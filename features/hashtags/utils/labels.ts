import { countLabel } from "@/lib/format"
import type { Hashtag } from "../types"

export function hashtagLabel(tag: string): string {
  return `#${tag}`
}

export function hashtagUsage(hashtag: Hashtag): string {
  return countLabel(hashtag.usage_count, "snacc")
}

/** The tag from a route segment. A malformed escape is shown as typed rather than crashing the page. */
export function tagFromParam(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}
