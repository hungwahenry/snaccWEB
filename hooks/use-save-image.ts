"use client"

import { useState } from "react"
import { openExternal } from "@/lib/links"
import { sameOriginMedia } from "@/lib/media-url"
import { shareOrDownload } from "@/lib/share-file"

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
      const blob = await fetch(sameOriginMedia(url)).then((res) => res.blob())
      const name = fileNameFor(url)
      await shareOrDownload(new File([blob], name, { type: blob.type }))
    } catch {
      openExternal(url)
    } finally {
      setSaving(false)
    }
  }

  return { saving, save: (url: string) => void save(url) }
}
