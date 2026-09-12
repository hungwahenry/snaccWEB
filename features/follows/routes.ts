import type { FollowTab } from "./types"

export const FOLLOW_REQUESTS_PATH = "/follow-requests"

export const followsPath = (username: string, tab: FollowTab) =>
  `/follows/${encodeURIComponent(username)}?tab=${tab}`
