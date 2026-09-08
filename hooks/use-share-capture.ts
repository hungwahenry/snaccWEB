"use client"

import { domToBlob } from "modern-screenshot"
import { useRef, useState } from "react"
import { toast } from "sonner"

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
      const file = new File([blob], fileName, { type: "image/png" })

      if (
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file] })
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") return
      toast.error("Could not share the card.")
    } finally {
      setBusy(false)
    }
  }

  return { cardRef, busy, share: () => void share() }
}

export type ShareCapture = ReturnType<typeof useShareCapture>
