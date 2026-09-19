"use client"

import { useState } from "react"
import { showErrorMessage } from "@/lib/feedback"
import { pickImages, readImages, type PickedImage } from "@/lib/media"

export function useDraftImages() {
  const [draft, setDraft] = useState<PickedImage[]>([])

  async function take(read: Promise<PickedImage[]>, max: number) {
    try {
      const picked = await read
      if (picked.length > 0)
        setDraft((current) => [...current, ...picked].slice(0, max))
    } catch {
      showErrorMessage("Could not read those images.")
    }
  }

  return {
    draft,
    add: (max: number) => void take(pickImages(max - draft.length), max),
    addFiles: (files: File[], max: number) =>
      void take(readImages(files, max - draft.length), max),
    remove: (uri: string) =>
      setDraft((current) => current.filter((image) => image.uri !== uri)),
    reset: () => setDraft([]),
  }
}
