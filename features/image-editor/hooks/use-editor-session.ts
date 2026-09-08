"use client"

import { useCallback, useState } from "react"
import {
  cropImage,
  rotateImage,
  type CropRect,
  type PickedImage,
} from "@/lib/media"
import type { Layer } from "../types"
import { exportScene } from "../utils/export"
import type { Size } from "../utils/geometry"

export function useEditorSession(image: PickedImage | null) {
  const [working, setWorking] = useState<PickedImage | null>(image)
  const [busy, setBusy] = useState(false)

  const [shownUri, setShownUri] = useState(image?.uri)
  if (image?.uri !== shownUri) {
    setShownUri(image?.uri)
    setWorking(image)
  }

  const flatten = useCallback(
    async (drawn: Size, layers: Layer[]): Promise<PickedImage | null> => {
      if (!working) return null
      setBusy(true)
      try {
        return await exportScene(working, drawn, layers)
      } finally {
        setBusy(false)
      }
    },
    [working]
  )

  const beginCrop = useCallback(
    async (drawn: Size, layers: Layer[]): Promise<void> => {
      if (layers.length === 0) return
      const flattened = await flatten(drawn, layers)
      if (flattened) setWorking(flattened)
    },
    [flatten]
  )

  const applyCrop = useCallback(
    async (rect: CropRect): Promise<void> => {
      if (!working) return
      setBusy(true)
      try {
        setWorking(await cropImage(working, rect))
      } finally {
        setBusy(false)
      }
    },
    [working]
  )

  const rotate = useCallback(async (): Promise<void> => {
    if (!working) return
    setBusy(true)
    try {
      setWorking(await rotateImage(working, 90))
    } finally {
      setBusy(false)
    }
  }, [working])

  return { working, busy, flatten, beginCrop, applyCrop, rotate }
}
