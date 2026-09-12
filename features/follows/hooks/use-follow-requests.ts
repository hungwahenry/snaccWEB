"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listFollowRequests } from "../api"
import { followKeys } from "../utils/keys"

export function useFollowRequests() {
  const enabled = useFlag("private_accounts")
  const { items, ...list } = useInfiniteList(
    followKeys.requests(),
    (page) => listFollowRequests(page),
    { enabled }
  )
  return { users: items, ...list }
}
