"use client"

import { useState } from "react"
import { useImageEditor } from "@/features/image-editor/hooks/use-image-editor"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { showErrorMessage } from "@/lib/feedback"
import { fromUrl, pickImages } from "@/lib/media"
import type { DraftImage } from "../../types"
import { draftImageKey, toPickedImages } from "../../utils/draft-images"

/** The photos a snacc carries: picked, edited, dropped, and how many more Premium would allow. */
export function useDraftImages(seed: DraftImage[]) {
  const [images, setImages] = useState<DraftImage[]>(seed)
  const editor = useImageEditor()

  const limit = usePremiumNudge(
    "content.snacc.max_images",
    (max) => images.length >= max,
    (upgrade) => `${upgrade} photos with Premium`
  )
  const maxImages = limit.value

  async function addImages() {
    try {
      const picked = await pickImages(maxImages - images.length)
      if (picked.length === 0) return
      setImages((current) =>
        [...current, ...toPickedImages(picked)].slice(0, maxImages)
      )
    } catch {
      showErrorMessage("Could not read those images.")
    }
  }

  async function editImage(key: string) {
    const target = images.find((image) => draftImageKey(image) === key)
    if (!target) return
    try {
      const asset =
        target.kind === "picked"
          ? target.asset
          : await fromUrl(target.url, "snacc.jpg")
      const edited = await editor.edit(asset)
      if (!edited) return
      setImages((current) =>
        current.map((image) =>
          draftImageKey(image) === key
            ? { kind: "picked", asset: edited }
            : image
        )
      )
    } catch {
      showErrorMessage("Could not open that image.")
    }
  }

  return {
    images,
    maxImages,
    imageUpgrade: limit,
    imageEditor: editor.sheet,
    addImages: () => void addImages(),
    editImage: (key: string) => void editImage(key),
    removeImage: (key: string) =>
      setImages((current) =>
        current.filter((image) => draftImageKey(image) !== key)
      ),
  }
}
