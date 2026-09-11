"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MINUTE_MS } from "@/lib/duration"
import { getUnreadMessageCount } from "../api"
import { messageKeys } from "../utils/keys"

export function useUnreadMessages() {
  const enabled = useFlag("anon_messages")
  return useQuery({
    queryKey: messageKeys.unread(),
    queryFn: getUnreadMessageCount,
    enabled,
    refetchInterval: 5 * MINUTE_MS,
  })
}
