import { getQueryClient } from "@/lib/query/client"
import type { PublicProfile } from "./types"
import { userKeys } from "./utils/keys"

export function onProfileCounts(payload: {
  username: string
  followers_count: number
  following_count: number
}): void {
  getQueryClient().setQueryData<PublicProfile>(
    userKeys.profile(payload.username),
    (profile) =>
      profile
        ? {
            ...profile,
            followers_count: payload.followers_count,
            following_count: payload.following_count,
          }
        : profile
  )
}
