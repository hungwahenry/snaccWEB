export const stickerKeys = {
  all: () => ["stickers"] as const,
  library: () => [...stickerKeys.all(), "library"] as const,
}
