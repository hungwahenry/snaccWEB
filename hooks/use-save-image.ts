"use client"

import { useState } from "react"
import { toast } from "sonner"
import { openExternal } from "@/lib/links"

function fileNameFor(url: string): string {
  const name = url.split("?")[0].split("/").pop()
  return name && /\.\w{3,4}$/.test(name) ? name : "snacc-image.jpg"
}

/// Hands the picture to the system share sheet where the browser has one, and otherwise saves it.
/// A picture the CDN will not share cross-origin opens in a new tab instead.
export function useSaveImage() {
  const [saving, setSaving] = useState(false)

  async function save(url: string): Promise<void> {
    if (saving) return
    setSaving(true)
    try {
      const blob = await fetch(url, { mode: "cors" }).then((res) => res.blob())
      const name = fileNameFor(url)
      const file = new File([blob], name, { type: blob.type })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
        return
      }

      const href = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = href
      link.download = name
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(href)
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") return
      openExternal(url)
    } finally {
      setSaving(false)
    }
  }

  return { saving, save: (url: string) => void save(url) }
}
