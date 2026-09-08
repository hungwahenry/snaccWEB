"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listBookmarks } from "../api"

export const SAVED_KEY = ["bookmarks"]

export function useSavedSnaccs() {
  const { items, ...list } = useInfiniteList(SAVED_KEY, listBookmarks)
  return { snaccs: items, ...list }
}
