"use client"

import { useLightbox } from "@/providers/lightbox-provider"
import { lightboxImagesOf } from "../utils/photos"
import { useConversationPhotos } from "./use-conversation-photos"

export function useConversationPhotoViewer(id: string) {
  const photos = useConversationPhotos(id)
  const lightbox = useLightbox()

  return {
    photos,
    onOpen: (index: number) =>
      lightbox.open({ images: lightboxImagesOf(photos.items), index }),
  }
}
