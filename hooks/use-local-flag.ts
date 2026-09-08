"use client"

import { useCallback, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1"
  } catch {
    return true
  }
}

/// A once-only flag kept in the browser (a nudge seen, an intro dismissed). Reads as "already
/// set" on the server and wherever storage is unavailable, so nothing nags where it cannot remember.
export function useLocalFlag(key: string): [boolean, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => true
  )

  const mark = useCallback(() => {
    try {
      window.localStorage.setItem(key, "1")
    } catch {
      // Storage refused the write; the flag simply will not persist.
    }
    listeners.forEach((listener) => listener())
  }, [key])

  return [value, mark]
}
