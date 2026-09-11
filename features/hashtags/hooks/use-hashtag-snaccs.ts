"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listHashtagSnaccs } from "../api"

export function useHashtagSnaccs(tag: string) {
  const { items, ...list } = useInfiniteList(snaccKeys.hashtag(tag), (page) =>
    listHashtagSnaccs(tag, page)
  )
  return { snaccs: items, ...list }
}
