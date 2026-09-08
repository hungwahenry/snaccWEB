"use client"

import { useCallback, useRef } from "react"
import { useBack } from "@/hooks/use-back"
import { pickImages } from "@/lib/media"
import type { MomentMode } from "../types"
import { useMomentComposer } from "./use-moment-composer"

export function useMomentComposeScreen() {
  const back = useBack("/home")
  const closing = useRef(false)

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    back()
  }, [back])

  const composer = useMomentComposer(close)
  const { setImage, setMode, image } = composer

  const pickPhoto = useCallback(async () => {
    const [first] = await pickImages(1)
    if (!first) return
    setImage(first)
    setMode("image")
  }, [setImage, setMode])

  const pickMode = useCallback(
    (next: MomentMode) => {
      setMode(next)
      if (next === "image" && !image) void pickPhoto()
    },
    [setMode, image, pickPhoto]
  )

  return { close, composer, pickMode }
}
