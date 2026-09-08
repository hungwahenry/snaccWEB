"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listHashtagSnaccs } from "../api"

export function useHashtagSnaccs(tag: string) {
  const { items, ...list } = useInfiniteList(
    ["hashtags", tag.toLowerCase(), "snaccs"],
    (page) => listHashtagSnaccs(tag, page)
  )
  return { snaccs: items, ...list }
}
