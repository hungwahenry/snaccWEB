import { api } from "@/lib/api/client"
import type { Gif } from "../types"

export function searchGifs(
  query: string,
  limit = 30,
  offset = 0
): Promise<Gif[]> {
  return api.get<Gif[]>("/giphy/search", { query, limit, offset })
}

export function trendingGifs(limit = 30, offset = 0): Promise<Gif[]> {
  return api.get<Gif[]>("/giphy/trending", { limit, offset })
}
