"use client"

import { useCallback, useSyncExternalStore } from "react"
import { refusalActive } from "../utils/age-refusal"

const KEY = "snacc_onboarding_age_refused"
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function readFor(cooldownMs: number): boolean {
  try {
    return refusalActive(
      Number(window.localStorage.getItem(KEY)),
      Date.now(),
      cooldownMs
    )
  } catch {
    return false
  }
}

function write(value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(KEY)
    else window.localStorage.setItem(KEY, value)
  } catch {}
  listeners.forEach((listener) => listener())
}

export function useAgeRefusal(cooldownMs: number) {
  const read = useCallback(() => readFor(cooldownMs), [cooldownMs])
  const refused = useSyncExternalStore(subscribe, read, () => false)

  const refuse = useCallback(() => write(String(Date.now())), [])
  const clear = useCallback(() => write(null), [])

  return { refused, refuse, clear }
}
