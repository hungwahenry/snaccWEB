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
