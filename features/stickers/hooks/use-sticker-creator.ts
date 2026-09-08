"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { getErrorMessage } from "@/lib/api/errors"
import {
  fromUrl,
  pickImages,
  type CropRect,
  type PickedImage,
} from "@/lib/media"
import { createSticker } from "../api"
import type { Sticker } from "../types"
import { exportSticker } from "../utils/export"
import { invalidateStickers } from "./use-sticker-library"

export function useStickerCreator(onCreated: (sticker: Sticker) => void) {
  const size = useConfigValue("content.sticker.max_edge")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [busy, setBusy] = useState(false)

  const upload = useMutation({
    mutationFn: createSticker,
    onSuccess: (sticker) => {
      invalidateStickers()
      setImage(null)
      onCreated(sticker)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const begin = useCallback(async () => {
    try {
      const [first] = await pickImages(1)
      if (first) setImage(first)
    } catch {
      toast.error("Could not read that image.")
    }
  }, [])

  const beginWith = useCallback(
    async (source: { url: string; width: number; height: number }) => {
      try {
        setImage(await fromUrl(source.url, "sticker-source.jpg"))
      } catch {
        toast.error("Could not read that picture.")
      }
    },
    []
  )

  async function create(rect: CropRect) {
    if (!image || busy || upload.isPending) return
    setBusy(true)
    try {
      upload.mutate(await exportSticker(image, rect, size))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return {
    image,
    busy: busy || upload.isPending,
    begin: () => void begin(),
    beginWith: (source: { url: string; width: number; height: number }) =>
      void beginWith(source),
    cancel: () => setImage(null),
    create: (rect: CropRect) => void create(rect),
  }
}

export type StickerCreator = ReturnType<typeof useStickerCreator>
