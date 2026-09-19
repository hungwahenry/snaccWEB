"use client"

import type { RefObject } from "react"
import { ScrubZone } from "@/features/voice/components/scrub-zone"
import { clock } from "@/features/voice/utils/clock"
import { cn } from "@/lib/utils"
import { useClipScrubber } from "../hooks/use-clip-scrubber"

type ClipScrubberProps = {
  video: RefObject<HTMLVideoElement | null>
  enabled: boolean
  durationMs: number
  countdown?: boolean
  className?: string
}

export function ClipScrubber({
  video,
  enabled,
  durationMs,
  countdown,
  className,
}: ClipScrubberProps) {
  const scrub = useClipScrubber(video, enabled, durationMs)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {countdown ? (
        <span className="rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
          {clock(durationMs - scrub.elapsedMs)}
        </span>
      ) : null}
      <ScrubZone
        className="relative flex-1"
        progress={scrub.progress}
        valueText={scrub.valueText}
        onBegin={scrub.onBegin}
        onMove={scrub.onMove}
        onEnd={scrub.onEnd}
        onCancel={scrub.onCancel}
      >
        {scrub.scrubbing ? (
          <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-sm font-bold text-white tabular-nums">
            {scrub.label}
          </span>
        ) : null}
        <span
          className={cn(
            "block w-full overflow-hidden rounded-full bg-white/30 transition-[height]",
            scrub.scrubbing ? "h-1.5" : "h-1"
          )}
        >
          <span
            className="block h-full rounded-full bg-white"
            style={{ width: `${scrub.progress * 100}%` }}
          />
        </span>
      </ScrubZone>
    </div>
  )
}
