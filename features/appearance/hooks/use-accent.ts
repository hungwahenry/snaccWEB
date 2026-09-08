"use client"

import { useSyncExternalStore } from "react"
import { INK, type Accent } from "../utils/accents"
import { readAccent, subscribeAccent, writeAccent } from "../utils/accent-store"

export function useAccent(): [Accent, (next: Accent) => void] {
  const accent = useSyncExternalStore(subscribeAccent, readAccent, () => INK)
  return [accent, writeAccent]
}
