"use client"

import { useEffect, useRef, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { showErrorMessage } from "@/lib/feedback"
import { pickVideo, readVideo, videoFrameAt } from "@/lib/media"
import { startClipUpload } from "../api"
import type { ClipDraft } from "../types"
import { CLIP_TYPES, clipProblem } from "../utils/clips"

const UNREADABLE = "Could not read that video."

export function useDraftClip() {
  const maxSeconds = useConfigValue("content.snacc.clip_max_seconds")
  const maxMb = useConfigValue("content.snacc.clip_max_mb")
  const [clip, setClip] = useState<ClipDraft | null>(null)
  const unposted = useRef<ClipDraft | null>(null)

  useEffect(() => () => drop(unposted.current), [])

  function keep(next: ClipDraft | null) {
    unposted.current = next
    setClip(next)
  }

  async function addClip() {
    const file = await pickVideo(CLIP_TYPES)
    if (!file) return

    try {
      const video = await readVideo(file)
      const problem = clipProblem(
        { type: file.type, sizeBytes: file.size, durationMs: video.durationMs },
        { maxSeconds, maxMb }
      )
      if (problem) {
        if (video.posterUrl) URL.revokeObjectURL(video.posterUrl)
        showErrorMessage(problem)
        return
      }
      drop(unposted.current)
      keep({ file, ...video, upload: startClipUpload(file) })
    } catch {
      showErrorMessage(UNREADABLE)
    }
  }

  async function setClipCover(ms: number) {
    const target = unposted.current
    if (!target) return

    const frame = await videoFrameAt(target.file, ms)
    if (!frame) return
    if (unposted.current !== target) {
      URL.revokeObjectURL(frame)
      return
    }

    if (target.posterUrl) URL.revokeObjectURL(target.posterUrl)
    keep({ ...target, posterUrl: frame, coverMs: Math.round(ms) })
  }

  return {
    clip,
    addClip,
    setClipCover: (ms: number) => void setClipCover(ms),
    removeClip: () => {
      drop(clip)
      keep(null)
    },
    handOffClip: () => {
      unposted.current = null
    },
  }
}

function drop(clip: ClipDraft | null) {
  if (!clip) return
  clip.upload.cancel()
  if (clip.posterUrl) URL.revokeObjectURL(clip.posterUrl)
}
