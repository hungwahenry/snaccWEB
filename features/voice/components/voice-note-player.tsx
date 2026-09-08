"use client"

import type { PointerEvent, ReactNode, Ref } from "react"
import { cn } from "@/lib/utils"
import { useVoiceNote, WAVE_HEIGHT, WAVE_WIDTH } from "../hooks/use-voice-note"
import { useVoiceNotePlayback } from "../hooks/use-voice-note-playback"
import type { VoiceNote } from "../types"
import { clock } from "../utils/clock"
import { PlayerButton } from "./player-button"
import { SpeedPill } from "./speed-pill"
import { VoiceBars } from "./voice-bars"

type VoiceNotePlayerProps = {
  note: VoiceNote
  onDark?: boolean
  fill?: boolean
}

export function VoiceNotePlayer({
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
      onDark={onDark}
      fill={fill}
      levels={row.levels}
      measure={row.measure}
      button={
        <PlayerButton playing={false} onDark={onDark} onPress={row.engage} />
      }
      clock={clock(note.duration_ms)}
    />
  )
}

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
      onDark={onDark}
      fill={fill}
      levels={levels}
      progress={playback.progress}
      measure={measure}
      button={
        <PlayerButton
          playing={playback.playing}
          loading={playback.loading}
          onDark={onDark}
          onPress={playback.toggle}
        />
      }
      speed={
        playback.playing ? (
          <SpeedPill
            speed={playback.speed}
            onDark={onDark}
            onPress={playback.cycleSpeed}
          />
        ) : undefined
      }
      clock={clock(playback.elapsedMs)}
      onBeginScrub={playback.beginScrub}
      onMoveScrub={playback.moveScrub}
      onEndScrub={playback.endScrub}
    />
  )
}

function PlayerRow({
  onDark,
  fill,
  levels,
  progress,
  measure,
  button,
  speed,
  clock: time,
  onBeginScrub,
  onMoveScrub,
  onEndScrub,
}: {
  onDark: boolean
  fill: boolean
  levels: number[]
  progress?: number
  measure: Ref<HTMLDivElement>
  button: ReactNode
  speed?: ReactNode
  clock: string
  onBeginScrub?: (fraction: number) => void
  onMoveScrub?: (fraction: number) => void
  onEndScrub?: (fraction: number) => void
}) {
  const wave = (
    <VoiceBars
      levels={levels}
      height={WAVE_HEIGHT}
      progress={progress}
      className={onDark ? "bg-background/30" : "bg-primary/30"}
      activeClassName={onDark ? "bg-background" : "bg-primary"}
    />
  )

  const seekable =
    progress !== undefined && onBeginScrub && onMoveScrub && onEndScrub

  return (
    <div className="flex items-center gap-3">
      {button}

      {seekable ? (
        <ScrubZone
          fill={fill}
          measure={measure}
          onBegin={onBeginScrub}
          onMove={onMoveScrub}
          onEnd={onEndScrub}
        >
          {wave}
        </ScrubZone>
      ) : (
        <div
          ref={fill ? measure : undefined}
          className={cn("flex items-center", fill && "flex-1")}
          style={fill ? undefined : { width: WAVE_WIDTH }}
        >
          {wave}
        </div>
      )}

      <div className="flex w-10 justify-end">
        {speed ?? (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              onDark ? "text-background/70" : "text-muted-foreground"
            )}
          >
            {time}
          </span>
        )}
      </div>
    </div>
  )
}

function fractionOf(event: PointerEvent<HTMLDivElement>): number {
  const rect = event.currentTarget.getBoundingClientRect()
  return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
}

function ScrubZone({
  fill,
  measure,
  onBegin,
  onMove,
  onEnd,
  children,
}: {
  fill: boolean
  measure: Ref<HTMLDivElement>
  onBegin: (fraction: number) => void
  onMove: (fraction: number) => void
  onEnd: (fraction: number) => void
  children: ReactNode
}) {
  return (
    <div
      ref={fill ? measure : undefined}
      className={cn(
        "-my-3 flex cursor-pointer touch-none items-center py-3",
        fill && "flex-1"
      )}
      style={fill ? undefined : { width: WAVE_WIDTH }}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => {
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
        onBegin(fractionOf(event))
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          onMove(fractionOf(event))
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId)
        onEnd(fractionOf(event))
      }}
      onPointerCancel={(event) => onEnd(fractionOf(event))}
    >
      {children}
    </div>
  )
}
