"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { useRef } from "react"
import { listFeed } from "../api"
import type { FeedScope } from "../types"

const newSeed = () => Math.random().toString(36).slice(2, 12)

export function useFeed(scope: FeedScope) {
  const seed = useRef(newSeed())
  const { items, ...list } = useInfiniteList(
    snaccKeys.feed(scope),
    (page) => listFeed(scope, page, seed.current),
    {
      onRefresh: () => {
        seed.current = newSeed()
      },
    }
  )
  return { snaccs: items, ...list }
}
