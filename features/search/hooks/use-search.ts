"use client"

import { useFollowableList } from "@/features/follows/hooks/use-followable-list"
import type { SearchHashtag } from "@/features/hashtags/types"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { searchHashtags, searchSnaccs, searchUsers } from "../api"

export function useSearchUsers(q: string) {
  return useFollowableList(
    ["search", "users", q],
    (page) => searchUsers(q, page),
    { enabled: q.length > 0 }
  )
}

export function useSearchSnaccs(q: string) {
  const { items, ...list } = useInfiniteList(
    ["search", "snaccs", q],
    (page) => searchSnaccs(q, page),
    { enabled: q.length > 0 }
  )
  return { snaccs: items, ...list }
}

export function useSearchHashtags(q: string) {
  const { items, ...list } = useInfiniteList<SearchHashtag>(
    ["search", "hashtags", q],
    (page) => searchHashtags(q, page),
    {
      enabled: q.length > 0,
    }
  )
  return { hashtags: items, ...list }
}
