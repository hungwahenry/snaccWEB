"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { estimateReach } from "../api"
import type { AdAudience } from "../types"
import { adKeys } from "../utils/keys"

const SETTLE_MS = 400

export function useCampaignReach(audience: AdAudience) {
  const settled = useDebouncedValue(audience, SETTLE_MS)

  return useQuery({
    queryKey: adKeys.reach(settled),
    queryFn: () => estimateReach(settled),
    placeholderData: keepPreviousData,
  })
}
