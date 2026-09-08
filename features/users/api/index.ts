import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { SnaccWithParent } from "@/features/snaccs/types"
import type { ProfileTab, PublicProfile, UserSuggestion } from "../types"

export function getProfile(username: string): Promise<PublicProfile> {
  return api.get<PublicProfile>(`/users/${encodeURIComponent(username)}`)
}

export function listUserSnaccs(
  username: string,
  tab: ProfileTab,
  page: number
): Promise<Paginated<SnaccWithParent>> {
  return api.get<Paginated<SnaccWithParent>>(
    `/users/${encodeURIComponent(username)}/snaccs`,
    { tab, page }
  )
}

export function suggestUsers(query: string): Promise<UserSuggestion[]> {
  return api.get<UserSuggestion[]>("/users/suggest", { query })
}
