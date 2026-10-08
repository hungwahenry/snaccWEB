import type { HeldListQuery, PackListQuery } from "../types"

export const adminStickerKeys = {
  all: () => ["admin", "stickers"] as const,
  packLists: () => ["admin", "stickers", "packs"] as const,
  packList: (query: PackListQuery) =>
    ["admin", "stickers", "packs", query] as const,
  pack: (id: string) => ["admin", "stickers", "pack", id] as const,
  heldList: (query: HeldListQuery) =>
    ["admin", "stickers", "held", query] as const,
}
