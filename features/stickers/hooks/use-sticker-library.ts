"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listStickers } from "../api"
import { stickerKeys } from "../utils/keys"

export function useStickerLibrary(enabled = true) {
  const { items, ...list } = useInfiniteList(
    stickerKeys.library(),
    listStickers,
    { enabled }
  )
  return { stickers: items, ...list }
}
