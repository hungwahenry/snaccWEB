export const STICKERS_PATH = "/stickers"

export const stickerPackPath = (id: string) =>
  `${STICKERS_PATH}/${encodeURIComponent(id)}`
