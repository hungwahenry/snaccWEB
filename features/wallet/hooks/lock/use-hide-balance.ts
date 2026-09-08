"use client"

import { useCallback, useSyncExternalStore } from "react"

const KEY = "snacc_wallet_hide_balance"
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

export function useHideBalance() {
  const hidden = useSyncExternalStore(subscribe, read, () => false)

  const toggle = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, read() ? "off" : "on")
    } catch {
      // Storage refused; the choice simply will not persist.
    }
    listeners.forEach((listener) => listener())
  }, [])

  return { hidden, toggle }
}
