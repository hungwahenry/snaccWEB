import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { FollowUser } from "@/features/follows/types"
import type { SearchHashtag } from "@/features/hashtags/types"
import type { Snacc } from "@/features/snaccs/types"

export function searchUsers(
  q: string,
  page: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>("/search/users", { q, page })
}

export function searchSnaccs(
  q: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>("/search/snaccs", { q, page })
}

export function searchHashtags(
  q: string,
  page: number
): Promise<Paginated<SearchHashtag>> {
  return api.get<Paginated<SearchHashtag>>("/search/hashtags", { q, page })
}
