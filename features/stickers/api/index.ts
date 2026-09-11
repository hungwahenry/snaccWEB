import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type { Sticker } from "../types"

export function listStickers(page: number): Promise<Paginated<Sticker>> {
  return api.get<Paginated<Sticker>>("/stickers", { page })
}

export function createSticker(image: PickedImage): Promise<Sticker> {
  const form = new FormData()
  appendImage(form, "image", image, "sticker")
  return api.upload<Sticker>("/stickers", form)
}

export function deleteSticker(id: string): Promise<void> {
  return api.del<void>(`/stickers/${encodeURIComponent(id)}`)
}

export function saveGiphySticker(giphyId: string): Promise<Sticker> {
  return api.post<Sticker>("/stickers/giphy", { giphyId })
}

export function saveMessageSticker(messageId: string): Promise<Sticker> {
  return api.post<Sticker>("/stickers/from-message", { messageId })
}

export function saveChatMessageSticker(
  chatMessageId: string
): Promise<Sticker> {
  return api.post<Sticker>("/stickers/from-chat-message", { chatMessageId })
}

export function saveSnaccSticker(snaccId: string): Promise<Sticker> {
  return api.post<Sticker>("/stickers/from-snacc", { snaccId })
}
