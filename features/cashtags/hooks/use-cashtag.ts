"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getCashtag } from "../api"
import { cashtagKeys } from "../utils/keys"

export function useCashtag(symbol: string) {
  return useQuery({
    queryKey: cashtagKeys.detail(symbol),
    queryFn: () => getCashtag(symbol),
    staleTime: MINUTE_MS,
  })
}
