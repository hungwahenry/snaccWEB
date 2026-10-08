import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type {
  KeepStickerFrom,
  Sticker,
  StickerPack,
  StickerPackDetail,
  StickerTray,
} from "../types"

const packPath = (id: string) => `/sticker-packs/${encodeURIComponent(id)}`

export function getStickerTray(): Promise<StickerTray> {
  return api.get<StickerTray>("/sticker-packs/tray")
}

export function getStickerCatalog(
  page: number
): Promise<Paginated<StickerPack>> {
  return api.get<Paginated<StickerPack>>("/sticker-packs/catalog", { page })
}

export function getMyStickerPacks(): Promise<StickerPack[]> {
  return api.get<StickerPack[]>("/sticker-packs/mine")
}

export function getStickerPack(id: string): Promise<StickerPackDetail> {
  return api.get<StickerPackDetail>(packPath(id))
}

export function createStickerPack(title: string): Promise<StickerPackDetail> {
  return api.post<StickerPackDetail>("/sticker-packs", { title })
}

export function renameStickerPack(input: {
  id: string
  title: string
}): Promise<StickerPackDetail> {
  return api.patch<StickerPackDetail>(packPath(input.id), {
    title: input.title,
  })
}

export async function deleteStickerPack(id: string): Promise<void> {
  await api.del(packPath(id))
}

export async function saveStickerPack(id: string): Promise<void> {
  await api.post(`${packPath(id)}/save`)
}

export async function unsaveStickerPack(id: string): Promise<void> {
  await api.del(`${packPath(id)}/save`)
}

export function addPackSticker(
  packId: string,
  image: PickedImage
): Promise<Sticker> {
  const form = new FormData()
  appendImage(form, "image", image, "sticker")
  return api.upload<Sticker>(`${packPath(packId)}/stickers`, form)
}

export async function removePackSticker(input: {
  packId: string
  stickerId: string
}): Promise<void> {
  await api.del(
    `${packPath(input.packId)}/stickers/${encodeURIComponent(input.stickerId)}`
  )
}

export function keepSticker(from: KeepStickerFrom): Promise<Sticker> {
  return "giphyId" in from
    ? api.post<Sticker>("/sticker-favourites/giphy", from)
    : api.post<Sticker>("/sticker-favourites", from)
}
