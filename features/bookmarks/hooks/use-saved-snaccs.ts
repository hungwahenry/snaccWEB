"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listBookmarks } from "../api"

export function useSavedSnaccs() {
  const { items, ...list } = useInfiniteList(
    snaccKeys.bookmarks(),
    listBookmarks
  )
  return { snaccs: items, ...list }
}
