import type { QueryKey } from "@tanstack/react-query"
import type { PublicProfile } from "@/features/users/types"
import { userKeys } from "@/features/users/utils/keys"
import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems, mapItems } from "@/lib/query/pages"
import type { FollowUser } from "../types"
import { followKeys } from "../utils/keys"

type Snapshot = [QueryKey, unknown][]

export interface FollowTarget {
  id: string
  username: string | null
}

const client = () => getQueryClient()

/**
 * Applies one follow or unfollow to their profile and to every loaded list that shows them.
 * A follow always starts with post notifications off, and an unfollow takes them away.
 */
export function setFollowing(target: FollowTarget, following: boolean): void {
  client().setQueriesData<PaginatedPages<FollowUser>>(
    { queryKey: followKeys.lists() },
    (data) =>
      mapItems(data, (user) =>
        user.id === target.id && user.is_following !== following
          ? { ...user, is_following: following }
          : user
      )
  )

  if (!target.username) return
  client().setQueryData<PublicProfile>(
    userKeys.profile(target.username),
    (profile) =>
      profile && profile.id === target.id && profile.is_following !== following
        ? {
            ...profile,
            is_following: following,
            notifying: false,
            followers_count: Math.max(
              0,
              profile.followers_count + (following ? 1 : -1)
            ),
          }
        : profile
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
