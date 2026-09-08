"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { FEED_KEY } from "@/lib/query-keys"
import { listFeed } from "@/features/feed/api"
import type { FeedScope, FeedSort } from "../types"

export function useFeed(scope: FeedScope, sort: FeedSort) {
  const { items, ...list } = useInfiniteList(
    [...FEED_KEY, scope, sort],
    (page) => listFeed(scope, page, sort)
  )
  return { snaccs: items, ...list }
}
