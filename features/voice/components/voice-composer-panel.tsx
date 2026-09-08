import { SquareIcon, Trash2Icon } from "lucide-react"
import type { VoiceDraft } from "../hooks/use-voice-recorder"
import { clock } from "../utils/clock"
import { RecordingWave } from "./recording-wave"
import { VoiceNotePlayer } from "./voice-note-player"

type VoiceComposerPanelProps = {
  recording: boolean
  durationMs: number
  levels: number[]
  voice: VoiceDraft | null
  stored?: { id: string; url: string; duration_ms: number } | null
  onStop: () => void
  onDiscard: () => void
}

export function VoiceComposerPanel({
  recording,
  durationMs,
  levels,
  voice,
  stored = null,
  onStop,
  onDiscard,
}: VoiceComposerPanelProps) {
  if (!recording && !voice && !stored) return null

  return (
    <div className="px-4 pt-3">
      <div className="flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5">
        {recording ? (
          <>
            <span className="size-2.5 shrink-0 animate-pulse rounded-full bg-destructive" />
            <span className="text-sm font-bold text-foreground tabular-nums">
              {clock(durationMs)}
            </span>
            <RecordingWave levels={levels} height={24} />
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop recording"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive text-background transition-opacity active:opacity-80"
            >
              <SquareIcon className="size-4" />
            </button>
          </>
        ) : stored ? (
          <div className="flex-1">
            <VoiceNotePlayer note={stored} fill />
          </div>
        ) : voice ? (
          <>
            <div className="flex-1">
              <VoiceNotePlayer
                note={{
                  id: voice.uri,
                  url: voice.uri,
                  duration_ms: voice.durationMs,
                }}
                fill
              />
            </div>
            <button
              type="button"
              onClick={onDiscard}
              aria-label="Discard voice note"
              className="flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-70"
            >
              <Trash2Icon className="size-5 text-muted-foreground" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
