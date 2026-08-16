import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminChallenge,
  CreateChallengeInput,
  ListChallengesParams,
  UpdateChallengeInput,
} from "./types"

export function listChallenges(params: ListChallengesParams) {
  return api.get<Paginated<AdminChallenge>>("/admin/challenges", params as QueryParams)
}

export function createChallenge(input: CreateChallengeInput) {
  return api.post<AdminChallenge>("/admin/challenges", input)
}

export function updateChallenge(id: string, input: UpdateChallengeInput) {
  return api.patch<AdminChallenge>(`/admin/challenges/${id}`, input)
}

export function deleteChallenge(id: string) {
  return api.del<null>(`/admin/challenges/${id}`)
}
