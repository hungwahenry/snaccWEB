"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listFeed } from "../api"
import type { FeedScope, FeedSort } from "../types"

export function useFeed(scope: FeedScope, sort: FeedSort) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.feed(scope, sort),
    (page) => listFeed(scope, page, sort)
  )
  return { snaccs: items, ...list }
}
