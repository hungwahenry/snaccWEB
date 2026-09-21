"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listFeed } from "../api"
import type { FeedScope } from "../types"

export function useFeed(scope: FeedScope) {
  const { items, ...list } = useInfiniteList(snaccKeys.feed(scope), (page) =>
    listFeed(scope, page)
  )
  return { snaccs: items, ...list }
}
