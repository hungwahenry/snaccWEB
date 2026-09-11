"use client"

import { useEggActions, useEggs } from "./use-eggs"

export function useEggsScreen() {
  return { query: useEggs(), actions: useEggActions() }
}
