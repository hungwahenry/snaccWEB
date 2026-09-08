import type { FeedScope, FeedSort } from "../types"

export const DEFAULT_FEED_SCOPE: FeedScope = "campus"

const SORT_KEY = "snacc_feed_sort"

export function rememberedFeedSort(): FeedSort | null {
  try {
    const raw = window.localStorage.getItem(SORT_KEY)
    return raw === "top" || raw === "latest" ? raw : null
  } catch {
    return null
  }
}

export function rememberFeedSort(sort: FeedSort): void {
  try {
    window.localStorage.setItem(SORT_KEY, sort)
  } catch {
    // Storage may be unavailable; the choice just does not survive the tab.
  }
}
