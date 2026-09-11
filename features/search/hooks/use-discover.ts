"use client"

import { useCallback, useState } from "react"
import { useMatchDetail } from "@/features/football/hooks/use-match-detail"
import { useMatchSnaccCounts } from "@/features/football/hooks/use-match-room"
import { useScoreboard } from "@/features/football/hooks/use-scoreboard"
import type { LiveMatch, MatchSnaccCounts } from "@/features/football/types"
import { useDiscoverRail } from "./use-discover-rail"

const NO_COUNTS: MatchSnaccCounts = {}

export function useDiscover() {
  const rail = useDiscoverRail()
  const scoreboard = useScoreboard()
  const counts = useMatchSnaccCounts()
  const [matchId, setMatchId] = useState<string | null>(null)
  const match = useMatchDetail(matchId)

  const matches = scoreboard.data?.matches ?? []
  const quiet =
    !scoreboard.isLoading &&
    !rail.tags.loading &&
    !rail.suggestions.loading &&
    matches.length === 0 &&
    rail.tags.tags.length === 0 &&
    rail.suggestions.users.length === 0

  const openMatch = useCallback((entry: LiveMatch) => setMatchId(entry.id), [])
  const onMatchSheetChange = useCallback((open: boolean) => {
    if (!open) setMatchId(null)
  }, [])

  return {
    ...rail,
    matchday: {
      loading: scoreboard.isLoading,
      matches,
      counts: counts.data ?? NO_COUNTS,
      onPressMatch: openMatch,
    },
    quiet,
    matchSheet: {
      open: matchId !== null,
      onOpenChange: onMatchSheetChange,
      detail: match.data ?? null,
      loading: match.isLoading,
      failed: match.isError,
    },
  }
}
