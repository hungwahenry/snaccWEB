import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { mapItems } from "@/lib/query/pages"
import type { StickerPack, StickerPackDetail, StickerTray } from "../types"
import { stickerKeys } from "../utils/keys"

export function refreshStickerPacks(): void {
  void getQueryClient().invalidateQueries({ queryKey: stickerKeys.lists() })
}

export function refreshStickerTray(): void {
  void getQueryClient().invalidateQueries({ queryKey: stickerKeys.tray() })
}

export function packStickersChanged(packId: string): void {
  void getQueryClient().invalidateQueries({
    queryKey: stickerKeys.pack(packId),
  })
  refreshStickerPacks()
}

export interface StickersSnapshot {
  tray: StickerTray | undefined
  pack: StickerPackDetail | undefined
}

export function dropSticker(
  packId: string,
  stickerId: string
): StickersSnapshot {
  const client = getQueryClient()
  const without = (pack: StickerPackDetail): StickerPackDetail =>
    pack.id === packId
      ? {
          ...pack,
          stickers: pack.stickers.filter((sticker) => sticker.id !== stickerId),
          stickers_count: Math.max(0, pack.stickers_count - 1),
        }
      : pack
  const snapshot = {
    tray: client.getQueryData<StickerTray>(stickerKeys.tray()),
    pack: client.getQueryData<StickerPackDetail>(stickerKeys.pack(packId)),
  }

  client.setQueryData<StickerTray>(
    stickerKeys.tray(),
    (tray) =>
      tray && {
        favourites: without(tray.favourites),
        packs: tray.packs.map(without),
      }
  )
  client.setQueryData<StickerPackDetail>(
    stickerKeys.pack(packId),
    (pack) => pack && without(pack)
  )
  return snapshot
}

export function restoreStickers(
  packId: string,
  snapshot: StickersSnapshot | undefined
): void {
  const client = getQueryClient()
  client.setQueryData(stickerKeys.tray(), snapshot?.tray)
  client.setQueryData(stickerKeys.pack(packId), snapshot?.pack)
}

export function findPack(id: string): StickerPackDetail | undefined {
  const tray = getQueryClient().getQueryData<StickerTray>(stickerKeys.tray())
  if (!tray) return undefined
  return [tray.favourites, ...tray.packs].find((pack) => pack.id === id)
}

export function setPackSaved(packId: string, saved: boolean): void {
  const client = getQueryClient()
  const mark = <T extends StickerPack>(pack: T): T =>
    pack.id === packId ? { ...pack, saved } : pack

  client.setQueryData<StickerPackDetail>(stickerKeys.pack(packId), (pack) =>
    pack ? mark(pack) : pack
  )
  client.setQueryData<PaginatedPages<StickerPack>>(
    stickerKeys.catalog(),
    (data) => mapItems(data, mark)
  )
  client.setQueryData<StickerPack[]>(stickerKeys.mine(), (packs) =>
    packs?.map(mark)
  )
}

export function putPack(pack: StickerPackDetail): void {
  getQueryClient().setQueryData(stickerKeys.pack(pack.id), pack)
  refreshStickerPacks()
}

export function dropPack(packId: string): void {
  const client = getQueryClient()
  client.setQueryData<StickerTray>(
    stickerKeys.tray(),
    (tray) =>
      tray && {
        ...tray,
        packs: tray.packs.filter((pack) => pack.id !== packId),
      }
  )
  client.setQueryData<StickerPack[]>(stickerKeys.mine(), (packs) =>
    packs?.filter((pack) => pack.id !== packId)
  )
}
