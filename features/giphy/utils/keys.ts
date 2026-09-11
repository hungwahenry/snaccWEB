import type { GiphyKind } from "../types"

export const giphyKeys = {
  all: () => ["giphy"] as const,
  kind: (kind: GiphyKind) => [...giphyKeys.all(), kind] as const,
  trending: (kind: GiphyKind) => [...giphyKeys.kind(kind), "trending"] as const,
  search: (kind: GiphyKind, term: string) =>
    [...giphyKeys.kind(kind), "search", term] as const,
}
