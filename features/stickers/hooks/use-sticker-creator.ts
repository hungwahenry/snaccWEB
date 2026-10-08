"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { showError, showErrorMessage, showNotice } from "@/lib/feedback"
import {
  fromUrl,
  pickImages,
  type CropRect,
  type PickedImage,
} from "@/lib/media"
import { addPackSticker, getStickerTray } from "../api"
import { packStickersChanged } from "../cache"
import type { Sticker, StickerSource } from "../types"
import { exportSticker } from "../utils/export"
import { stickerKeys } from "../utils/keys"

interface Upload {
  packId: string | null
  image: PickedImage
}

export function useStickerCreator(onCreated?: (sticker: Sticker) => void) {
  const queryClient = useQueryClient()
  const size = useConfigValue("content.sticker.max_edge")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [packId, setPackId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const upload = useMutation({
    mutationFn: async ({ packId, image }: Upload) => {
      const target =
        packId ??
        (
          await queryClient.ensureQueryData({
            queryKey: stickerKeys.tray(),
            queryFn: getStickerTray,
          })
        ).favourites.id
      return addPackSticker(target, image)
    },
    onSuccess: (sticker) => {
      packStickersChanged(sticker.pack_id)
      setImage(null)
      if (sticker.held) {
        showNotice(
          "We're checking your sticker first. You can send it once it clears."
        )
        return
      }
      onCreated?.(sticker)
    },
  })

  const begin = useCallback((target: string) => {
    pickImages(1)
      .then(([first]) => {
        if (!first) return
        setPackId(target)
        setImage(first)
      })
      .catch(() => showErrorMessage("Could not read that image."))
  }, [])

  const beginWith = useCallback((source: StickerSource) => {
    fromUrl(source.url, "sticker-source.jpg")
      .then((picked) => {
        setPackId(null)
        setImage(picked)
      })
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
        .then((exported) => mutate({ packId, image: exported }))
        .catch(showError)
        .finally(() => setExporting(false))
    },
    [image, busy, size, packId, mutate]
  )

  return { image, busy, begin, beginWith, cancel, create }
}
