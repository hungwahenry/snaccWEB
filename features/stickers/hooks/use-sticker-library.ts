"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getQueryClient } from "@/lib/query-client"
import { listStickers } from "../api"
import { STICKERS_KEY } from "../utils/keys"

export function useStickerLibrary(options: { enabled?: boolean } = {}) {
  const { items, ...list } = useInfiniteList(
    STICKERS_KEY,
    listStickers,
    options
  )
  return { stickers: items, ...list }
}

export function invalidateStickers(): void {
  void getQueryClient().invalidateQueries({ queryKey: STICKERS_KEY })
}
