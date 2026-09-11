"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { showError, showErrorMessage } from "@/lib/feedback"
import {
  fromUrl,
  pickImages,
  type CropRect,
  type PickedImage,
} from "@/lib/media"
import { createSticker } from "../api"
import { refreshStickerLibrary } from "../cache"
import type { Sticker, StickerSource } from "../types"
import { exportSticker } from "../utils/export"

export function useStickerCreator(onCreated: (sticker: Sticker) => void) {
  const size = useConfigValue("content.sticker.max_edge")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [exporting, setExporting] = useState(false)

  const upload = useMutation({
    mutationFn: createSticker,
    onSuccess: (sticker) => {
      refreshStickerLibrary()
      setImage(null)
      onCreated(sticker)
    },
  })

  const begin = useCallback(() => {
    pickImages(1)
      .then(([first]) => {
        if (first) setImage(first)
      })
      .catch(() => showErrorMessage("Could not read that image."))
  }, [])

  const beginWith = useCallback((source: StickerSource) => {
    fromUrl(source.url, "sticker-source.jpg")
      .then(setImage)
      .catch(() => showErrorMessage("Could not read that picture."))
  }, [])

  const cancel = useCallback(() => setImage(null), [])

  const busy = exporting || upload.isPending
  const { mutate } = upload

  const create = useCallback(
    (rect: CropRect) => {
      if (!image || busy) return
      setExporting(true)
      exportSticker(image, rect, size)
        .then((sticker) => mutate(sticker))
        .catch(showError)
        .finally(() => setExporting(false))
    },
    [image, busy, size, mutate]
  )

  return { image, busy, begin, beginWith, cancel, create }
}
