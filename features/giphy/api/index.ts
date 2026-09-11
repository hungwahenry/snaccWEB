import { api } from "@/lib/api/client"
import type { Gif } from "../types"

const PAGE_SIZE = 30

export function searchGifs(
  query: string,
  limit = PAGE_SIZE,
  offset = 0
): Promise<Gif[]> {
  return api.get<Gif[]>("/giphy/search", { query, limit, offset })
}

export function getTrendingGifs(limit = PAGE_SIZE, offset = 0): Promise<Gif[]> {
  return api.get<Gif[]>("/giphy/trending", { limit, offset })
}

export function searchGiphyStickers(
  query: string,
  limit = PAGE_SIZE,
  offset = 0
): Promise<Gif[]> {
  return api.get<Gif[]>("/stickers/giphy/search", { query, limit, offset })
}

export function getTrendingGiphyStickers(
  limit = PAGE_SIZE,
  offset = 0
): Promise<Gif[]> {
  return api.get<Gif[]>("/stickers/giphy/trending", { limit, offset })
}
