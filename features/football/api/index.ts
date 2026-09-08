import { api } from "@/lib/api/client"
import type { MatchDetail, Scoreboard } from "../types"

export const getScoreboard = () => api.get<Scoreboard>("/football/matches")

export const getMatchDetail = (matchId: string) =>
  api.get<MatchDetail>(`/football/matches/${matchId}`)
