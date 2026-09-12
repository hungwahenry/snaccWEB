"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { getMatchDetail } from "../api"
import { onMatchUpdated } from "../realtime"
import type { MatchUpdate } from "../types"
import { footballKeys } from "../utils/keys"
import { matchPollEvery, mayStillChange } from "../utils/live"

export function useMatchDetail(matchId: string | null) {
  const pushed = useFlag("realtime")
  const query = useQuery({
    queryKey: footballKeys.match(matchId ?? ""),
    queryFn: () => getMatchDetail(matchId!),
    enabled: matchId !== null,
    staleTime: 30_000,
    refetchInterval: (query) =>
      matchPollEvery(query.state.data?.match.status, pushed),
  })

  const listening =
    matchId !== null && pushed && mayStillChange(query.data?.match.status)
  useRealtimeRoom(listening ? realtimeRooms.match(matchId) : null)
  useRealtimeEvent("match.updated", (payload) =>
    onMatchUpdated(payload as MatchUpdate)
  )

  return query
}
