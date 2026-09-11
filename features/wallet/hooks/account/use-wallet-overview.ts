"use client"

import { useQuery } from "@tanstack/react-query"
import { getWalletOverview } from "../../api"
import { walletKeys } from "../../utils/keys"

export function useWalletOverview(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: walletKeys.overview(),
    queryFn: getWalletOverview,
    enabled: options.enabled,
  })
}
