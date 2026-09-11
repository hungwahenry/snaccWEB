"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listUserSnaccs } from "../api"
import type { ProfileTab } from "../types"

export function useUserSnaccs(username: string, tab: ProfileTab) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.user(username, tab),
    (page) => listUserSnaccs(username, tab, page),
    { enabled: username.length > 0 }
  )
  return { snaccs: items, ...list }
}
