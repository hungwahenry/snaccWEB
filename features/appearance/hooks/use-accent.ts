"use client"

import { useSyncExternalStore } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { INK, type Accent } from "../utils/accents"
import { pickAccent, readAccent, subscribeAccent } from "../utils/accent-store"

export function useWornAccent(): Accent {
  return useSyncExternalStore(subscribeAccent, readAccent, () => INK)
}

export function useAccent(): [Accent, (next: Accent) => void] {
  const accent = useWornAccent()
  const userId = useMe().data?.id

  return [
    accent,
    (next) => {
      if (userId) pickAccent(next, userId)
    },
  ]
}
