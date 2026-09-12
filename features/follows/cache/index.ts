import type { QueryKey } from "@tanstack/react-query"
import type { PublicProfile } from "@/features/users/types"
import { userKeys } from "@/features/users/utils/keys"
import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems, mapItems } from "@/lib/query/pages"
import type { FollowState, FollowUser } from "../types"
import { followKeys } from "../utils/keys"

type Snapshot = [QueryKey, unknown][]

export interface FollowTarget {
  id: string
  username: string | null
}

const client = () => getQueryClient()

/**
 * Applies one follow, request or unfollow to their profile and to every loaded list that shows them.
 * A follow always starts with post notifications off, and an unfollow takes them away.
 */
export function setFollowState(target: FollowTarget, state: FollowState): void {
  const following = state === "following"

  client().setQueriesData<PaginatedPages<FollowUser>>(
    { queryKey: followKeys.lists() },
    (data) =>
      mapItems(data, (user) =>
        user.id === target.id && user.follow_state !== state
          ? { ...user, is_following: following, follow_state: state }
          : user
      )
  )

  if (!target.username) return
  client().setQueryData<PublicProfile>(
    userKeys.profile(target.username),
    (profile) => {
      if (!profile || profile.id !== target.id) return profile
      if (profile.follow_state === state) return profile
      const counted = following !== profile.is_following

      return {
        ...profile,
        is_following: following,
        follow_state: state,
        can_view: !profile.is_private || following,
        notifying: false,
        followers_count: counted
          ? Math.max(0, profile.followers_count + (following ? 1 : -1))
          : profile.followers_count,
      }
    }
  )
}

export function snapshotFollows(target: FollowTarget): Snapshot {
  const lists = client().getQueriesData({ queryKey: followKeys.lists() })
  if (!target.username) return lists

  const key = userKeys.profile(target.username)
  return [...lists, [key, client().getQueryData(key)]]
}

export function restoreFollows(snapshot: Snapshot): void {
  snapshot.forEach(([key, data]) => client().setQueryData(key, data))
}

/** Takes someone out of every loaded list of people, as after a block. */
export function removePerson(userId: string): void {
  client().setQueriesData<PaginatedPages<FollowUser>>(
    { queryKey: followKeys.lists() },
    (data) => filterItems(data, (user) => user.id !== userId)
  )
}

/** A request answered: out of the list, and off the count above Notifications. */
export function removeRequest(userId: string): void {
  client().setQueryData<PaginatedPages<FollowUser>>(
    followKeys.requests(),
    (data) => filterItems(data, (user) => user.id !== userId)
  )
  client().setQueryData<number>(followKeys.requestsCount(), (count) =>
    count === undefined ? count : Math.max(0, count - 1)
  )
}

export function requestsChanged(): void {
  void client().invalidateQueries({ queryKey: followKeys.requests() })
  void client().invalidateQueries({ queryKey: followKeys.requestsCount() })
}

/** Someone you removed leaves your followers list at once. */
export function dropFollower(ownUsername: string, userId: string): void {
  getQueryClient().setQueryData<PaginatedPages<FollowUser>>(
    followKeys.follows(ownUsername, "followers"),
    (data) => filterItems(data, (user) => user.id !== userId)
  )
}
