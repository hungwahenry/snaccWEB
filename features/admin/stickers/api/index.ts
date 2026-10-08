import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type {
  AdminSticker,
  AdminStickerPack,
  AdminStickerPackDetail,
  HeldListQuery,
  HeldSticker,
  PackListQuery,
  UpdatePackInput,
} from "../types"

export function listStickerPacks(query: PackListQuery) {
  return api.get<Paginated<AdminStickerPack>>("/admin/sticker-packs", query)
}

export function getStickerPack(id: string) {
  return api.get<AdminStickerPackDetail>(`/admin/sticker-packs/${id}`)
}

export function createStickerPack(title: string) {
  return api.post<AdminStickerPackDetail>("/admin/sticker-packs", { title })
}

export function updateStickerPack(id: string, input: UpdatePackInput) {
  return api.patch<AdminStickerPackDetail>(`/admin/sticker-packs/${id}`, input)
}

export function publishStickerPack(id: string) {
  return api.post<AdminStickerPackDetail>(`/admin/sticker-packs/${id}/publish`)
}

export function unpublishStickerPack(id: string) {
  return api.post<AdminStickerPackDetail>(
    `/admin/sticker-packs/${id}/unpublish`
  )
}

export function setPackDefault(id: string, on: boolean) {
  return api.put<AdminStickerPackDetail>(`/admin/sticker-packs/${id}/default`, {
    on,
  })
}

export function setPackFeatured(id: string, on: boolean) {
  return api.put<AdminStickerPackDetail>(
    `/admin/sticker-packs/${id}/featured`,
    { on }
  )
}

export function deleteStickerPack(id: string) {
  return api.del<null>(`/admin/sticker-packs/${id}`)
}

export function uploadPackSticker(id: string, image: PickedImage) {
  const form = new FormData()
  appendImage(form, "image", image, "sticker")

  return api.upload<AdminSticker>(`/admin/sticker-packs/${id}/stickers`, form)
}

export function removePackSticker(id: string, stickerId: string) {
  return api.del<null>(`/admin/sticker-packs/${id}/stickers/${stickerId}`)
}

export function listHeldStickers(query: HeldListQuery) {
  return api.get<Paginated<HeldSticker>>("/admin/stickers/held", query)
}

export function releaseSticker(id: string, note?: string) {
  return api.post<null>(`/admin/stickers/${id}/release`, { note })
}

export function removeSticker(id: string, note?: string) {
  return api.del<null>(`/admin/stickers/${id}`, { note })
}

export function takeDownStickerPack(id: string, note?: string) {
  return api.post<null>(`/admin/stickers/packs/${id}/take-down`, { note })
}
