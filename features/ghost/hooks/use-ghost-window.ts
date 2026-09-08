"use client"

import { useQuery } from "@tanstack/react-query"
import { useNow } from "@/hooks/use-now"
import { MINUTE_MS } from "@/lib/duration"
import { isGhostActive } from "@/features/ghost/utils/active"
import { getGhostWindow } from "@/features/ghost/api"

export const GHOST_WINDOW_KEY = ["ghost", "window"]

const TICK_MS = 15_000

export function useGhostWindow() {
  const { data, dataUpdatedAt } = useQuery({
    queryKey: GHOST_WINDOW_KEY,
    queryFn: getGhostWindow,
    refetchInterval: 5 * MINUTE_MS,
    staleTime: MINUTE_MS,
  })
  const now = useNow(TICK_MS)

  const skewMs =
    data && dataUpdatedAt ? Date.parse(data.server_time) - dataUpdatedAt : 0
  const startsAt = data?.starts_at ? new Date(data.starts_at) : null
  const endsAt = data?.ends_at ? new Date(data.ends_at) : null

  return {
    active: isGhostActive(data, now + skewMs),
    startsAt,
    endsAt,
    skewMs,
    now: now + skewMs,
  }
}
