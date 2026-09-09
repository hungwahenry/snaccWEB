"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getEggCollection } from "../api"

export const EGGS_KEY = ["eggs"]

/**
 * Reads the collection and nothing else. Eggs are found in the app — the detectors are built on
 * device gestures and ambient signals the browser has no equivalent for — so the web lists what
 * someone already has rather than pretending it can arm anything.
 */
export function useEggCollection() {
  return useQuery({
    queryKey: EGGS_KEY,
    queryFn: getEggCollection,
    staleTime: MINUTE_MS,
  })
}
