"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { signal } from "@/features/signals/utils/queue"
import type { SnaccClip } from "@/features/snaccs/types"
import { forgetPlace } from "../../place"
import { clipsPath } from "../../routes"
import { isReadyClip } from "../../utils/viewer"
import { useClipPreview } from "../autoplay/use-clip-preview"

type ClipCardInput = {
  clip: SnaccClip
  spoiler?: boolean
  snaccId?: string
}

export function useClipCard({ clip, spoiler, snaccId }: ClipCardInput) {
  const clipsOn = useFlag("snacc_clips")
  const [revealedFor, setRevealedFor] = useState<string | null>(null)
  const key = snaccId ?? clip.id
  const ready = isReadyClip(clip)
  const href = snaccId && clipsOn ? clipsPath(snaccId, !!spoiler) : null
  const preview = useClipPreview(ready && !spoiler && href !== null)

  return {
    href,
    hidden: !!spoiler && revealedFor !== key,
    watch: preview.watch,
    previewUrl: preview.playing ? clip.hls_url : null,
    open: forgetPlace,
    reveal: () => {
      signal("spoiler_reveal", { subjectId: snaccId })
      setRevealedFor(key)
    },
  }
}
