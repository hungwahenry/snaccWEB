import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"
import type { MatchDetail, MatchSnaccCounts, Scoreboard } from "../types"

export const getScoreboard = () => api.get<Scoreboard>("/football/matches")

export const getMatchDetail = (matchId: string) =>
  api.get<MatchDetail>(`/football/matches/${matchId}`)

export const getMatchSnaccs = (matchId: string, page: number) =>
  api.get<Paginated<Snacc>>(`/football/matches/${matchId}/snaccs`, { page })

export const getMatchSnaccCounts = () =>
  api.get<MatchSnaccCounts>("/football/matches/snacc-counts")
