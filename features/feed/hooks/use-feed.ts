"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { flushViews } from "@/features/views/utils/flush"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listFeed } from "../api"
import type { FeedScope } from "../types"

export function useFeed(scope: FeedScope) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.feed(scope),
    async (page, snapshot) => {
      if (!snapshot) await flushViews()
      return listFeed(scope, page, snapshot)
    }
  )
  return { snaccs: items, ...list }
}
