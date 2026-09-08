import type { Gif } from "@/features/giphy/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import { appendImage, type PickedImage } from "@/lib/media"
import type { Sticker } from "../types"

export function createSticker(image: PickedImage): Promise<Sticker> {
  const form = new FormData()
  appendImage(form, "image", image, "sticker")
  return api.upload<Sticker>("/stickers", form)
}

export const deleteSticker = (id: string) => api.del<void>(`/stickers/${id}`)

export const listStickers = (page: number) =>
  api.get<Paginated<Sticker>>("/stickers", { page })

export const saveGiphySticker = (giphyId: string) =>
  api.post<Sticker>("/stickers/giphy", { giphyId })

export const saveMessageSticker = (messageId: string) =>
  api.post<Sticker>("/stickers/from-message", { messageId })

export const saveSnaccSticker = (snaccId: string) =>
  api.post<Sticker>("/stickers/from-snacc", { snaccId })

export const searchStickers = (params: {
  query: string
  limit?: number
  offset?: number
}) => api.get<Gif[]>("/stickers/giphy/search", params)

export const trendingStickers = (
  params: { limit?: number; offset?: number } = {}
) => api.get<Gif[]>("/stickers/giphy/trending", params)
