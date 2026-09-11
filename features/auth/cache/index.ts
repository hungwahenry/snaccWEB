import type { Profile, PublicProfile, User } from "@/features/users/types"
import { userKeys } from "@/features/users/utils/keys"
import { getQueryClient } from "@/lib/query/client"
import { authKeys } from "../utils/keys"

const client = () => getQueryClient()

export function readMe(): User | undefined {
  return client().getQueryData<User>(authKeys.me())
}

function withProfile(
  publicProfile: PublicProfile,
  mine: Profile
): PublicProfile {
  return {
    ...publicProfile,
    username: mine.username,
    display_name: mine.display_name,
    avatar_url: mine.avatar_url,
    cover_url: mine.cover_url,
    bio: mine.bio,
    major: mine.major,
    graduation_year: mine.graduation_year,
    graduated: mine.graduated,
    university: mine.university,
    birthday: mine.birthday,
    is_birthday: mine.is_birthday,
    official: mine.official,
    premium: mine.premium,
  }
}

/**
 * The server answered with the new signed-in account. It becomes the cached one, and every loaded
 * copy of your public profile shows the change at once before being fetched again.
 */
export function meChanged(user: User): void {
  const before = readMe()?.profile?.username ?? null
  client().setQueryData(authKeys.me(), user)

  const mine = user.profile
  if (!mine) return

  client().setQueriesData<PublicProfile>(
    { queryKey: userKeys.profiles() },
    (profile) =>
      profile && profile.id === user.id ? withProfile(profile, mine) : profile
  )

  if (before && before !== mine.username) {
    client().removeQueries({ queryKey: userKeys.profile(before) })
  }
  if (mine.username) {
    void client().invalidateQueries({
      queryKey: userKeys.profile(mine.username),
    })
  }
}

export function refreshMe(): Promise<void> {
  return client().invalidateQueries({ queryKey: authKeys.me() })
}
