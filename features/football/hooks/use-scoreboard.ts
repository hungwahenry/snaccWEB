"use client"

import { useQuery } from "@tanstack/react-query"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { getScoreboard } from "../api"
import { onScoreboard } from "../realtime"
import type { Scoreboard } from "../types"
import { footballKeys } from "../utils/keys"
import { pollEvery } from "../utils/live"

export function useScoreboard() {
  const enabled = useFlag("live_scores")
  const pushed = useFlag("realtime")

  useRealtimeRoom(enabled && pushed ? realtimeRooms.football : null)
  useRealtimeEvent("football.scoreboard", (payload) =>
    onScoreboard(payload as Scoreboard)
  )

  return useQuery({
    queryKey: footballKeys.scoreboard(),
    queryFn: getScoreboard,
    enabled,
    staleTime: 30_000,
    refetchInterval: pollEvery(pushed),
  })
}
