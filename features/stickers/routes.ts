export const STICKERS_PATH = "/stickers"

export const MY_STICKER_PACKS_PATH = `${STICKERS_PATH}/mine`

export const stickerPackPath = (id: string) =>
  `${STICKERS_PATH}/${encodeURIComponent(id)}`
