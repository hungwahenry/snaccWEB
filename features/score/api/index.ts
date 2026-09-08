import { api } from "@/lib/api/client"
import type { ScoreStanding, ScoreTier } from "@/features/score/types"

export function getMyScore(): Promise<ScoreStanding> {
  return api.get<ScoreStanding>("/score/me")
}

export function getTiers(): Promise<ScoreTier[]> {
  return api.get<ScoreTier[]>("/score/tiers")
}
