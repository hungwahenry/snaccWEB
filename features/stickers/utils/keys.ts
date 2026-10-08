const LIST = "sticker-packs"

export const stickerKeys = {
  pack: (id: string) => ["sticker-pack", id] as const,

  lists: () => [LIST] as const,
  tray: () => [LIST, "tray"] as const,
  catalog: () => [LIST, "catalog"] as const,
  mine: () => [LIST, "mine"] as const,
}

export const stickerMutationKeys = {
  save: () => ["sticker-packs", "save"] as const,
}
