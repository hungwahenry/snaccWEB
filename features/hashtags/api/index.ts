import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Snacc } from "@/features/snaccs/types"
import type { HashtagSuggestion, SearchHashtag } from "../types"

export function listHashtagSnaccs(
  tag: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(
    `/hashtags/${encodeURIComponent(tag)}/snaccs`,
    { page }
  )
}

export function suggestHashtags(query: string): Promise<HashtagSuggestion[]> {
  return api.get<HashtagSuggestion[]>("/hashtags/suggest", { query })
}

export function getPopularHashtags(): Promise<SearchHashtag[]> {
  return api.get<SearchHashtag[]>("/hashtags/popular")
}
