"use client"

import { useQuery } from "@tanstack/react-query"
import { getMomentViewers } from "../api"
import { momentViewersKey } from "../utils/keys"

export function useMomentViewers(momentId: string | null) {
  return useQuery({
    queryKey: momentViewersKey(momentId ?? ""),
    queryFn: () => getMomentViewers(momentId as string),
    enabled: Boolean(momentId),
  })
}
