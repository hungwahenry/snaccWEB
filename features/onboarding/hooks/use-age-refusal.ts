"use client"

import { useCallback, useSyncExternalStore } from "react"

const KEY = "snacc_onboarding_age_refused"
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "on"
  } catch {
    return false
  }
}

export function useAgeRefusal() {
  const refused = useSyncExternalStore(subscribe, read, () => false)

  const refuse = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, "on")
    } catch {}
    listeners.forEach((listener) => listener())
  }, [])

  return { refused, refuse }
}
