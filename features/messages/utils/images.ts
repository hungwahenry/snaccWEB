import type { Message, MessageImage, ShownImage } from "../types"

export function viewOnceOf(message: Message): MessageImage | undefined {
  if (message.removed) return undefined
  return message.images.find((image) => image.view_once)
}

export function shownImagesOf(message: Message): ShownImage[] {
  if (message.removed || viewOnceOf(message)) return []
  return message.images.filter(
    (image): image is ShownImage => image.url !== null
  )
}

/** The photo a sticker can be cut from: the first one shown, if any. */
export function stickerSourceOf(
  message: Message
): { url: string; width: number; height: number } | null {
  const [image] = shownImagesOf(message)
  return image
    ? { url: image.url, width: image.width, height: image.height }
    : null
}

/** What a view-once card says, before and after the photo is opened. */
export function viewOnceText(
  photo: MessageImage,
  mine: boolean
): { gone: boolean; label: string; hint: string } {
  const gone = photo.opened || !photo.available
  if (gone) {
    return {
      gone,
      label: "Photo opened",
      hint: mine ? "They have seen it" : "It is gone now",
    }
  }
  return {
    gone,
    label: mine ? "Photo sent" : "Tap to view once",
    hint: "Seen once, then deleted",
  }
}
