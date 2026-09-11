"use client"

import { useEffect, useState } from "react"
import { showErrorMessage } from "@/lib/feedback"

const SHOWN_MS = 1600

/** Copies a value and flips `copied` on for a moment, so the button can say it worked. */
export function useCopyFeedback(value: string) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), SHOWN_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      showErrorMessage("Couldn't copy that.")
    }
  }

  return { copied, copy: () => void copy() }
}
