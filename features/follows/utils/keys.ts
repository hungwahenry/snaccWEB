import type { FollowTab } from "../types"

/** Every paged list of people with a Follow button lives under `people-list`. */
const LIST = "people-list"

export const followKeys = {
  lists: () => [LIST] as const,
  follows: (username: string, tab: FollowTab) =>
    [LIST, "follows", username.toLowerCase(), tab] as const,
  search: (q: string) => [LIST, "search", q] as const,
  visitors: () => [LIST, "visitors"] as const,
  suggestions: () => [LIST, "suggestions"] as const,
}
