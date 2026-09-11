"use client"

import { useQuery } from "@tanstack/react-query"
import { getLimits } from "../../api"
import { walletKeys } from "../../utils/keys"

export function useLimits(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: walletKeys.limits(),
    queryFn: getLimits,
    enabled: options.enabled,
  })
}
