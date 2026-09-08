import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { FollowTab, FollowUser } from "../types"

export async function followUser(userId: string): Promise<void> {
  await api.post("/follows", { userId })
}

export async function unfollowUser(userId: string): Promise<void> {
  await api.del(`/follows/${userId}`)
}

export async function setPostNotifications(
  userId: string,
  enabled: boolean
): Promise<void> {
  await api.put(`/follows/${userId}/notifications`, { enabled })
}

export function getFollowSuggestions(): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>("/follows/suggestions")
}

export function listFollows(
  username: string,
  tab: FollowTab,
  page: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>(`/users/${username}/${tab}`, { page })
}
