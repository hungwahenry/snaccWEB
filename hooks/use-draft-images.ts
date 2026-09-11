"use client"

import { useState } from "react"
import { showErrorMessage } from "@/lib/feedback"
import { pickImages, type PickedImage } from "@/lib/media"

/** Photos picked for something not yet sent: add up to a limit, remove, clear. */
export function useDraftImages() {
  const [draft, setDraft] = useState<PickedImage[]>([])

  async function add(max: number) {
    try {
      const picked = await pickImages(max - draft.length)
      if (picked.length > 0)
        setDraft((current) => [...current, ...picked].slice(0, max))
    } catch {
      showErrorMessage("Could not read those images.")
    }
  }

  return {
    draft,
    add: (max: number) => void add(max),
    remove: (uri: string) =>
      setDraft((current) => current.filter((image) => image.uri !== uri)),
    reset: () => setDraft([]),
  }
}
