import { toLightboxImage, type LightboxImage } from "@/lib/lightbox/images"
import type { ConversationPhoto } from "../types"

export function lightboxImagesOf(photos: ConversationPhoto[]): LightboxImage[] {
  return photos.map(({ image }) => toLightboxImage(image))
}
