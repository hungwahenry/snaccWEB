"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { FeedSort } from "../types"
import { DEFAULT_FEED_SORT, feedSortOf } from "../utils/sorts"

const KEY = "snacc_feed_sort"
const listeners = new Set<() => void>()
let picked: FeedSort | null = null

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function stored(): FeedSort | null {
  try {
    return feedSortOf(window.localStorage.getItem(KEY))
  } catch {
    return null
  }
}

// What was picked this session wins, so the choice still sticks where storage is blocked.
function read(): FeedSort {
  return picked ?? stored() ?? DEFAULT_FEED_SORT
}

/** The feed order you picked last, kept on this device. */
export function useFeedSort(): [FeedSort, (sort: FeedSort) => void] {
  const sort = useSyncExternalStore(subscribe, read, () => DEFAULT_FEED_SORT)

  const remember = useCallback((next: FeedSort) => {
    picked = next
    try {
      window.localStorage.setItem(KEY, next)
    } catch {}
    listeners.forEach((listener) => listener())
  }, [])

  return [sort, remember]
}
