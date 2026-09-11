"use client"

import { listFollows } from "../api"
import type { FollowTab } from "../types"
import { followKeys } from "../utils/keys"
import { usePeopleList } from "./use-people-list"

export function useFollowList(username: string, tab: FollowTab) {
  return usePeopleList(followKeys.follows(username, tab), (page) =>
    listFollows(username, tab, page)
  )
}
