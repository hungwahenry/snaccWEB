"use client"

import { memo, type ReactNode, type Ref } from "react"
import { cn } from "@/lib/utils"
import { useVoiceNote } from "../hooks/use-voice-note"
import { useVoiceNotePlayback } from "../hooks/use-voice-note-playback"
import type { VoiceNote } from "../types"
import { clock } from "../utils/clock"
import { positionLabel, voiceNoteLabel } from "../utils/labels"
import { WAVE_HEIGHT, WAVE_WIDTH } from "../utils/wave"
import { PlayerButton } from "./player-button"
import { ScrubZone } from "./scrub-zone"
import { SpeedPill } from "./speed-pill"
import { VoiceBars } from "./voice-bars"

type VoiceNotePlayerProps = {
  note: VoiceNote
  onDark?: boolean
  /** Stretch the waveform across the row instead of a fixed width, e.g. inside a reply box. */
  fill?: boolean
}

/**
 * A self-contained player: playback is local to the row (like a <video>), so it runs its own
 * audio hooks. Only one note plays at a time across the app.
 */
export const VoiceNotePlayer = memo(function VoiceNotePlayer({
  note,
  onDark = false,
  fill = false,
}: VoiceNotePlayerProps) {
  const row = useVoiceNote(note)

  if (row.engaged) {
    return (
      <EngagedPlayer
        note={note}
        onDark={onDark}
        fill={fill}
        levels={row.levels}
        measure={row.measure}
        onRelease={row.release}
      />
    )
  }

  return (
    <PlayerRow
      label={voiceNoteLabel(note.duration_ms)}
      fill={fill}
      button={
        <PlayerButton playing={false} onDark={onDark} onPress={row.engage} />
      }
      wave={
        <div
          ref={fill ? row.measure : undefined}
          className={waveClass(fill)}
          style={fill ? undefined : { width: WAVE_WIDTH }}
        >
          <Wave levels={row.levels} onDark={onDark} />
        </div>
      }
      trailing={<Clock time={clock(note.duration_ms)} onDark={onDark} />}
    />
  )
})

function EngagedPlayer({
  note,
  onDark,
  fill,
  levels,
  measure,
  onRelease,
}: {
  note: VoiceNote
  onDark: boolean
  fill: boolean
  levels: number[]
  measure: Ref<HTMLDivElement>
  onRelease: () => void
}) {
  const playback = useVoiceNotePlayback(note, onRelease)

  return (
    <PlayerRow
      label={voiceNoteLabel(playback.totalMs)}
      fill={fill}
      button={
        <PlayerButton
          playing={playback.playing}
          loading={playback.loading}
          onDark={onDark}
          onPress={playback.toggle}
        />
      }
      wave={
        <ScrubZone
          measure={fill ? measure : undefined}
          className={waveClass(fill)}
          style={fill ? undefined : { width: WAVE_WIDTH }}
          progress={playback.progress}
          valueText={positionLabel(playback.elapsedMs, playback.totalMs)}
          onBegin={playback.beginScrub}
          onMove={playback.moveScrub}
          onEnd={playback.endScrub}
          onCancel={playback.cancelScrub}
        >
          <Wave levels={levels} onDark={onDark} progress={playback.progress} />
        </ScrubZone>
      }
      trailing={
        playback.playing ? (
          <SpeedPill
            speed={playback.speed}
            onDark={onDark}
            onPress={playback.cycleSpeed}
          />
        ) : (
          <Clock time={clock(playback.elapsedMs)} onDark={onDark} />
        )
      }
    />
  )
}

function waveClass(fill: boolean): string {
  return cn(
    "flex items-center",
    fill ? "min-w-0 flex-1 overflow-hidden" : "shrink-0"
  )
}

function PlayerRow({
  label,
  fill,
  button,
  wave,
  trailing,
}: {
  label: string
  fill: boolean
  button: ReactNode
  wave: ReactNode
  trailing: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex items-center gap-3", fill && "w-full min-w-0")}
    >
      {button}
      {wave}
      <div className="flex w-10 shrink-0 justify-end">{trailing}</div>
    </div>
  )
}

function Wave({
  levels,
  onDark,
  progress,
}: {
  levels: number[]
  onDark: boolean
  progress?: number
}) {
  return (
    <VoiceBars
      levels={levels}
      height={WAVE_HEIGHT}
      progress={progress}
      className={onDark ? "bg-background/30" : "bg-primary/30"}
      activeClassName={onDark ? "bg-background" : "bg-primary"}
    />
  )
}

function Clock({ time, onDark }: { time: string; onDark: boolean }) {
  return (
    <span
      className={cn(
        "text-xs font-medium tabular-nums",
        onDark ? "text-background/70" : "text-muted-foreground"
      )}
    >
      {time}
    </span>
  )
}
