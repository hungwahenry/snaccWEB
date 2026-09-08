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

export function useLocalFlag(key: string): [boolean, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => true
  )

  const mark = useCallback(() => {
    try {
      window.localStorage.setItem(key, "1")
    } catch {}
    listeners.forEach((listener) => listener())
  }, [key])

  return [value, mark]
}
