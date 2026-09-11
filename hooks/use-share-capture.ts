"use client"

import { domToBlob } from "modern-screenshot"
import { useRef, useState } from "react"
import { showErrorMessage } from "@/lib/feedback"
import { shareOrDownload } from "@/lib/share-file"

export function useShareCapture(fileName = "snacc.png") {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  async function share() {
    const node = cardRef.current
    if (!node || busy) return
    setBusy(true)
    try {
      const blob = await domToBlob(node, { scale: 2, type: "image/png" })
      if (!blob) throw new Error("empty")
      await shareOrDownload(new File([blob], fileName, { type: "image/png" }))
    } catch {
      showErrorMessage("Could not share the card.")
    } finally {
      setBusy(false)
    }
  }

  return { cardRef, busy, share: () => void share() }
}

export type ShareCapture = ReturnType<typeof useShareCapture>
