"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useFlag } from "@/features/config/hooks/use-flag"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { pickImages, type PickedImage } from "@/lib/media"

export function useMessageAttachments() {
  const [draft, setDraft] = useState<PickedImage[]>([])
  const [viewOnce, setViewOnce] = useState(false)
  const imagesEnabled = useFlag("message_images")
  const viewOnceEnabled = useFlag("message_view_once")
  const imageLimit = usePremiumNudge(
    "content.message.max_images",
    (max) => draft.length >= max,
    (upgrade) => `${upgrade} photos with Premium`
  )
  const maxImages = imagesEnabled ? imageLimit.value : 0

  async function onAddImages() {
    try {
      const picked = await pickImages(maxImages - draft.length)
      if (picked.length > 0)
        setDraft((current) => [...current, ...picked].slice(0, maxImages))
    } catch {
      toast.error("Could not read those images.")
    }
  }

  return {
    draft,
    viewOnce,
    viewOnceEnabled,
    maxImages,
    imageUpgrade: imageLimit,
    onAddImages: () => void onAddImages(),
    onToggleViewOnce: () => setViewOnce((current) => !current),
    onRemoveImage: (uri: string) => {
      setViewOnce(false)
      setDraft((current) => current.filter((image) => image.uri !== uri))
    },
    reset: () => {
      setDraft([])
      setViewOnce(false)
    },
  }
}
