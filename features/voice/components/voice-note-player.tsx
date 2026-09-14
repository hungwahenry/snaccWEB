"use client"

import { memo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useVoiceNote } from "../hooks/use-voice-note"
import type { VoiceNote, VoiceSource } from "../types"
import { clock } from "../utils/clock"
import { positionLabel, voiceNoteLabel } from "../utils/labels"
import { WAVE_HEIGHT, WAVE_WIDTH } from "../utils/wave"
import { PlayerButton } from "./player-button"
import { ScrubZone } from "./scrub-zone"
import { SpeedPill } from "./speed-pill"
import { VoiceBars } from "./voice-bars"

type VoiceNotePlayerProps = {
  note: VoiceNote
  source: VoiceSource | null
  onDark?: boolean
  /** Stretch the waveform across the row instead of a fixed width, e.g. inside a reply box. */
  fill?: boolean
}

export const VoiceNotePlayer = memo(function VoiceNotePlayer({
  note,
  source,
  onDark = false,
  fill = false,
}: VoiceNotePlayerProps) {
  const row = useVoiceNote(note, source)

  if (!row.engaged) {
    return (
      <PlayerRow
        label={voiceNoteLabel(note.duration_ms)}
        fill={fill}
        button={
          <PlayerButton playing={false} onDark={onDark} onPress={row.play} />
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
  }

  return (
    <PlayerRow
      label={voiceNoteLabel(row.totalMs)}
      fill={fill}
      button={
        <PlayerButton
          playing={row.playing}
          loading={row.loading}
          onDark={onDark}
          onPress={row.toggle}
        />
      }
      wave={
        <ScrubZone
          measure={fill ? row.measure : undefined}
          className={waveClass(fill)}
          style={fill ? undefined : { width: WAVE_WIDTH }}
          progress={row.progress}
          valueText={positionLabel(row.elapsedMs, row.totalMs)}
          onBegin={row.beginScrub}
          onMove={row.moveScrub}
          onEnd={row.endScrub}
          onCancel={row.cancelScrub}
        >
          <Wave levels={row.levels} onDark={onDark} progress={row.progress} />
        </ScrubZone>
      }
      trailing={
        row.playing ? (
          <SpeedPill
            speed={row.speed}
            onDark={onDark}
            onPress={row.cycleSpeed}
          />
        ) : (
          <Clock time={clock(row.elapsedMs)} onDark={onDark} />
        )
      }
    />
  )
})

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
