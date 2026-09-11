"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { useDraftImages } from "@/hooks/use-draft-images"

/** The photos waiting in the composer, and whether the one photo goes as view once. */
export function useMessageAttachments() {
  const images = useDraftImages()
  const [viewOnce, setViewOnce] = useState(false)
  const imagesEnabled = useFlag("message_images")
  const viewOnceEnabled = useFlag("message_view_once")
  const imageLimit = usePremiumNudge(
    "content.message.max_images",
    (max) => images.draft.length >= max,
    (upgrade) => `${upgrade} photos with Premium`
  )
  const maxImages = imagesEnabled ? imageLimit.value : 0

  return {
    draft: images.draft,
    viewOnce: viewOnceEnabled && viewOnce && images.draft.length === 1,
    viewOnceEnabled,
    maxImages,
    imageUpgrade: imageLimit,
    onAddImages: () => images.add(maxImages),
    onToggleViewOnce: () => setViewOnce((current) => !current),
    onRemoveImage: (uri: string) => {
      setViewOnce(false)
      images.remove(uri)
    },
    reset: () => {
      images.reset()
      setViewOnce(false)
    },
  }
}
