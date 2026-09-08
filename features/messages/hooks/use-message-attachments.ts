"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { pickImages, type PickedImage } from "@/lib/media"

export function useMessageAttachments() {
  const [draft, setDraft] = useState<PickedImage[]>([])
  const [viewOnce, setViewOnce] = useState(false)
  const imagesEnabled = useFlag("message_images")
  const viewOnceEnabled = useFlag("message_view_once")
  const imageCap = useConfigValue("content.message.max_images")
  const maxImages = imagesEnabled ? imageCap : 0

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
