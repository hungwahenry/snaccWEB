"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { MINUTE_MS } from "@/lib/duration"
import { fetchUnreadMessages } from "../api"
import { UNREAD_MESSAGES_KEY } from "../utils/keys"

export function useUnreadMessages() {
  const enabled = useFlag("anon_messages")
  return useQuery({
    queryKey: UNREAD_MESSAGES_KEY,
    queryFn: fetchUnreadMessages,
    enabled,
    refetchInterval: 5 * MINUTE_MS,
  })
}
