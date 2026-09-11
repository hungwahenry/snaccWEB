"use client"

import { useTierActions, useTiers } from "./use-score-tiers"

export function useScoreTiersScreen() {
  return { query: useTiers(), actions: useTierActions() }
}
