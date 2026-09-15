"use client"

import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { showErrorMessage } from "@/lib/feedback"
import { pickVideo, readVideo } from "@/lib/media"
import type { ClipDraft } from "../types"
import { clipProblem } from "../utils/clips"

const UNREADABLE = "Could not read that video."

export function useDraftClip() {
  const maxSeconds = useConfigValue("content.snacc.clip_max_seconds")
  const maxMb = useConfigValue("content.snacc.clip_max_mb")
  const [clip, setClip] = useState<ClipDraft | null>(null)

  async function addClip() {
    const file = await pickVideo()
    if (!file) return

    try {
      const video = await readVideo(file)
      const problem = clipProblem(
        { type: file.type, sizeBytes: file.size, durationMs: video.durationMs },
        { maxSeconds, maxMb }
      )
      if (problem) {
        URL.revokeObjectURL(video.url)
        showErrorMessage(problem)
        return
      }
      setClip({ file, ...video })
    } catch {
      showErrorMessage(UNREADABLE)
    }
  }

  function removeClip() {
    if (clip) URL.revokeObjectURL(clip.url)
    setClip(null)
  }

  return { clip, addClip, removeClip }
}
