import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { mapItems } from "@/lib/query/pages"
import type { StickerPack, StickerPackDetail } from "../types"
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

export function dropPackSticker(
  packId: string,
  stickerId: string
): StickerPackDetail | undefined {
  const client = getQueryClient()
  const key = stickerKeys.pack(packId)
  const previous = client.getQueryData<StickerPackDetail>(key)
  client.setQueryData<StickerPackDetail>(key, (pack) =>
    pack
      ? {
          ...pack,
          stickers: pack.stickers.filter((sticker) => sticker.id !== stickerId),
          stickers_count: Math.max(0, pack.stickers_count - 1),
        }
      : pack
  )
  return previous
}

export function restorePack(
  packId: string,
  previous: StickerPackDetail | undefined
): void {
  getQueryClient().setQueryData(stickerKeys.pack(packId), previous)
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
