"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { listFollowRequests } from "../api"
import { followKeys } from "../utils/keys"

/** How many people are waiting on you, for the row above Notifications. */
export function useFollowRequestsCount(): number {
  const enabled = useFlag("private_accounts")
  const query = useQuery({
    queryKey: followKeys.requestsCount(),
    queryFn: async () => (await listFollowRequests(1, 1)).total,
    enabled,
  })

  return enabled ? (query.data ?? 0) : 0
}
