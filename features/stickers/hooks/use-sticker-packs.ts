"use client"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import {
  getMyStickerPacks,
  getStickerCatalog,
  getStickerPack,
  getStickerTray,
} from "../api"
import { stickerKeys } from "../utils/keys"

export function useStickerTrayPacks(enabled: boolean) {
  return useQuery({
    queryKey: stickerKeys.tray(),
    queryFn: getStickerTray,
    enabled,
  })
}

export function useStickerPack(id: string | null, enabled = true) {
  return useQuery({
    queryKey: stickerKeys.pack(id ?? ""),
    queryFn: () => getStickerPack(id ?? ""),
    enabled: enabled && id !== null,
  })
}

export function useStickerCatalog(enabled: boolean) {
  const { items, ...list } = useInfiniteList(
    stickerKeys.catalog(),
    getStickerCatalog,
    { enabled }
  )
  return { packs: items, ...list }
}

export function useMyStickerPacks(enabled: boolean) {
  return useQuery({
    queryKey: stickerKeys.mine(),
    queryFn: getMyStickerPacks,
    enabled,
  })
}
