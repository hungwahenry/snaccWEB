"use client"

import { listFollows } from "../api"
import type { FollowTab } from "../types"
import { useFollowableList } from "./use-followable-list"

export function useFollowList(username: string, tab: FollowTab) {
  return useFollowableList(["users", tab, username.toLowerCase()], (page) =>
    listFollows(username, tab, page)
  )
}
