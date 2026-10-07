"use client"

import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { countReach } from "../api"
import type { AudienceInput } from "../types"
import { adminAnnouncementKeys } from "../utils/keys"

const REACH_DEBOUNCE_MS = 400

export function useAnnouncementReach(audience: AudienceInput | null) {
  const settled = useDebouncedValue(audience, REACH_DEBOUNCE_MS)
  const query = useQuery({
    queryKey: adminAnnouncementKeys.reach(settled),
    queryFn: settled ? () => countReach(settled) : skipToken,
    placeholderData: keepPreviousData,
  })

  return {
    count: audience ? query.data?.count : undefined,
    counting: audience !== null && (audience !== settled || query.isFetching),
    failed: audience !== null && query.isError,
  }
}
