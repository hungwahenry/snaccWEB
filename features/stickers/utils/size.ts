/** How a sticker sits in a square of `size`: the long side fills it. */
export function stickerBox(
  sticker: { width: number; height: number },
  size: number
): { width: number; height: number } {
  const ratio =
    sticker.width > 0 && sticker.height > 0 ? sticker.width / sticker.height : 1
  const width = ratio >= 1 ? size : size * ratio
  return { width, height: width / ratio }
}
