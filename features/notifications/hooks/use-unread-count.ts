"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getUnreadCount } from "../api"

export const UNREAD_KEY = ["notifications", "unread"]

export function useUnreadCount() {
  return useQuery({
    queryKey: UNREAD_KEY,
    queryFn: getUnreadCount,
    refetchInterval: 5 * MINUTE_MS,
  })
}
