import type { LightboxImage } from "@/components/ui/lightbox-viewer"
import type { ConversationPhoto } from "../types"

export function lightboxImagesOf(photos: ConversationPhoto[]): LightboxImage[] {
  return photos.map(({ image }) => ({
    url: image.url,
    width: image.width,
    height: image.height,
  }))
}
