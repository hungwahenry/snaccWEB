import type { Author, User } from "../types"

/** You, the way others see you next to something you just posted. The score is left blank: the
 * server's copy replaces this one a moment later. */
export function authorFromUser(user: User): Author {
  const profile = user.profile
  const university = profile?.official ? null : (profile?.university ?? null)

  return {
    id: user.id,
    username: profile?.username ?? null,
    display_name: profile?.display_name ?? null,
    avatar_url: profile?.avatar_url ?? "",
    university: university
      ? {
          id: university.id,
          name: university.name,
          acronym: university.acronym,
          slug: university.slug,
        }
      : null,
    score: { tier: null, og: false },
    official: profile?.official ?? false,
    premium: profile?.premium ?? false,
    is_birthday: profile?.is_birthday ?? false,
  }
}
