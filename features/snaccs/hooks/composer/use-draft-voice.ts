"use client"

import { useEffect, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useVoiceRecorder } from "@/features/voice/hooks/use-voice-recorder"
import type { VoiceDraft } from "@/features/voice/types"

/** A voice note for the snacc: recording it, keeping the take, or throwing it away. */
export function useDraftVoice(seed: VoiceDraft | null) {
  const recorder = useVoiceRecorder()
  const maxSeconds = useConfigValue("content.snacc.voice_max_seconds")
  const [voice, setVoice] = useState<VoiceDraft | null>(seed)
  const { recording, durationMs, stop } = recorder

  useEffect(() => {
    if (!recording || durationMs < maxSeconds * 1000) return
    void stop().then((take) => {
      if (take) setVoice(take)
    })
  }, [recording, durationMs, maxSeconds, stop])

  return {
    voice,
    recording,
    recordingMs: durationMs,
    recordingLevels: recorder.levels,
    startVoice: () => void recorder.start(),
    stopVoice: () =>
      void stop().then((take) => {
        if (take) setVoice(take)
      }),
    discardVoice: () => {
      if (recording) void recorder.cancel()
      setVoice(null)
    },
  }
}
