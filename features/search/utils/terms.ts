import type { SearchTab } from "../types"

/**
 * What to send for a tab. People type "#tag" and "@name" out of habit, but tags are stored
 * without the hash and usernames without the at sign, so those would never match.
 */
export function searchTermFor(tab: SearchTab, term: string): string {
  if (tab === "tags") return term.replace(/^#+/, "").trim()
  if (tab === "people") return term.replace(/^@+/, "").trim()
  return term
}
