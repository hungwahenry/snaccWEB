"use client"

import { SquareIcon, Trash2Icon } from "lucide-react"
import { VoiceBeam } from "voice-glow"
import { IconButton } from "@/components/ui/icon-button"
import type { VoiceDraft, VoiceNote } from "../types"
import { clock } from "../utils/clock"
import { RecordingDot } from "./recording-dot"
import { RecordingWave } from "./recording-wave"
import { VoiceNotePlayer } from "./voice-note-player"

type VoiceComposerPanelProps = {
  recording: boolean
  durationMs: number
  levels: number[]
  live?: MediaStream | null
  voice: VoiceDraft | null
  stored?: VoiceNote | null
  onStop: () => void
  onDiscard: () => void
}

export function VoiceComposerPanel({
  recording,
  durationMs,
  levels,
  live = null,
  voice,
  stored = null,
  onStop,
  onDiscard,
}: VoiceComposerPanelProps) {
  if (!recording && !voice && !stored) return null

  return (
    <div className="px-4 pt-3">
      <VoiceBeam active={recording} stream={live} scale={0.8}>
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border px-3 py-2.5">
          {recording ? (
            <>
              <RecordingDot />
              <span className="text-sm font-bold text-foreground tabular-nums">
                {clock(durationMs)}
              </span>
              <RecordingWave levels={levels} height={24} />
              <IconButton
                icon={SquareIcon}
                label="Stop recording"
                onClick={onStop}
                className="bg-destructive text-background hover:bg-destructive/90"
                iconClassName="size-4"
              />
            </>
          ) : stored ? (
            <div className="min-w-0 flex-1">
              <VoiceNotePlayer note={stored} source={null} fill />
            </div>
          ) : voice ? (
            <>
              <div className="min-w-0 flex-1">
                <VoiceNotePlayer
                  note={{
                    id: voice.uri,
                    url: voice.uri,
                    duration_ms: voice.durationMs,
                  }}
                  source={null}
                  fill
                />
              </div>
              <IconButton
                icon={Trash2Icon}
                label="Discard voice note"
                onClick={onDiscard}
                className="text-muted-foreground"
                iconClassName="size-5"
              />
            </>
          ) : null}
        </div>
      </VoiceBeam>
    </div>
  )
}
