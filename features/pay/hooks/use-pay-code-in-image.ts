"use client"

import { useEffect, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { sameOriginMedia } from "@/lib/media-url"
import { usernameFromPayCode } from "../utils/pay-code"

type Detector = {
  detect: (source: ImageBitmapSource) => Promise<{ rawValue: string }[]>
}

type DetectorCtor = new (options: { formats: string[] }) => Detector

const read = new Map<string, string | null>()

function detector(): Detector | null {
  const ctor = (window as unknown as { BarcodeDetector?: DetectorCtor })
    .BarcodeDetector
  return ctor ? new ctor({ formats: ["qr_code"] }) : null
}

async function scan(url: string): Promise<string | null> {
  const found = detector()
  if (!found) return null

  const response = await fetch(sameOriginMedia(url))
  const bitmap = await createImageBitmap(await response.blob())
  try {
    for (const code of await found.detect(bitmap)) {
      const username = usernameFromPayCode(code.rawValue)
      if (username) return username
    }
  } finally {
    bitmap.close()
  }

  return null
}

export interface PayCodeInImage {
  username: string
  mine: boolean
}

export function usePayCodeInImage(url: string | null): PayCodeInImage | null {
  const enabled = useFlag("wallet")
  const me = useMe()
  const [found, setFound] = useState<string | null>(null)

  const [shownUrl, setShownUrl] = useState(url)
  if (url !== shownUrl) {
    setShownUrl(url)
    setFound(enabled && url ? (read.get(url) ?? null) : null)
  }

  useEffect(() => {
    if (!enabled || !url || read.has(url)) return
    let live = true

    void scan(url)
      .catch(() => null)
      .then((username) => {
        read.set(url, username)
        if (live) setFound(username)
      })

    return () => {
      live = false
    }
  }, [enabled, url])

  if (!found) return null

  const mine = me.data?.profile?.username?.toLowerCase()
  return { username: found, mine: found.toLowerCase() === mine }
}
