import type { SearchTab } from "./types"

export const SEARCH_PATH = "/search"

export function searchPath(params: { q?: string; tab?: SearchTab } = {}) {
  const search = new URLSearchParams()
  const q = params.q?.trim()
  if (q) search.set("q", q)
  if (params.tab) search.set("tab", params.tab)
  const qs = search.toString()
  return qs ? `${SEARCH_PATH}?${qs}` : SEARCH_PATH
}
