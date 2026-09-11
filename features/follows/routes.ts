import type { FollowTab } from "./types"

export const followsPath = (username: string, tab: FollowTab) =>
  `/follows/${encodeURIComponent(username)}?tab=${tab}`
