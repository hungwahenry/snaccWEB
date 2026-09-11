"use client"

import { useQuery } from "@tanstack/react-query"
import { HOUR_MS } from "@/lib/duration"
import { getBanks } from "../../api"
import { walletKeys } from "../../utils/keys"

export function useBanks() {
  return useQuery({
    queryKey: walletKeys.banks(),
    queryFn: getBanks,
    staleTime: HOUR_MS,
  })
}
