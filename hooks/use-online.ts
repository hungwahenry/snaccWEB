"use client"

import { onlineManager } from "@tanstack/react-query"
import { useSyncExternalStore } from "react"

const subscribe = (listener: () => void) => onlineManager.subscribe(listener)

export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => onlineManager.isOnline(),
    () => true
  )
}
