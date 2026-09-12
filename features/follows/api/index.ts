import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { FollowState, FollowTab, FollowUser } from "../types"

/** Following, or only asked: a private account has to say yes first. */
export async function followUser(userId: string): Promise<FollowState> {
  const result = await api.post<{ state: FollowState } | null>("/follows", {
    userId,
  })
  return result?.state ?? "following"
}

/** Unfollows, or takes back a request that is still waiting. */
export async function unfollowUser(userId: string): Promise<void> {
  await api.del(`/follows/${encodeURIComponent(userId)}`)
}

export async function setPostNotifications(
  userId: string,
  enabled: boolean
): Promise<void> {
  await api.put(`/follows/${encodeURIComponent(userId)}/notifications`, {
    enabled,
  })
}

export function listFollowSuggestions(
  page: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>("/follows/suggestions", { page })
}

export function listFollows(
  username: string,
  tab: FollowTab,
  page: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>(
    `/users/${encodeURIComponent(username)}/${tab}`,
    { page }
  )
}

export function listFollowRequests(
  page: number,
  perPage?: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>("/follows/requests", {
    page,
    perPage,
  })
}

export async function acceptFollowRequest(userId: string): Promise<void> {
  await api.post(`/follows/requests/${encodeURIComponent(userId)}/accept`)
}

export async function declineFollowRequest(userId: string): Promise<void> {
  await api.del(`/follows/requests/${encodeURIComponent(userId)}`)
}

export async function removeFollower(userId: string): Promise<void> {
  await api.del(`/follows/followers/${encodeURIComponent(userId)}`)
}
