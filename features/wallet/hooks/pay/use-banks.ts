"use client"

import { useQuery } from "@tanstack/react-query"
import { HOUR_MS } from "@/lib/duration"
import { getBanks } from "../../api"
import { BANKS_KEY } from "../../utils/keys"

export function useBanks() {
  return useQuery({
    queryKey: BANKS_KEY,
    queryFn: getBanks,
    staleTime: HOUR_MS,
  })
}
