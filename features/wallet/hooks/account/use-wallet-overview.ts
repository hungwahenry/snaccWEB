"use client"

import { useQuery } from "@tanstack/react-query"
import { getWalletOverview } from "../../api"
import { WALLET_OVERVIEW_KEY } from "../../utils/keys"

export function useWalletOverview(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: WALLET_OVERVIEW_KEY,
    queryFn: getWalletOverview,
    enabled: options.enabled,
  })
}
