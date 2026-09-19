"use client"

import { useState } from "react"
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react"
import { signal } from "@/features/signals/utils/queue"
import { SpoilerVeil } from "@/features/snaccs/components/card/media/spoiler-veil"
import type { SnaccClip } from "@/features/snaccs/types"
import { clock } from "@/features/voice/utils/clock"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import { useInlineClip } from "../hooks/use-inline-clip"
import { isReadyClip } from "../utils/viewer"
import { ClipProcessing } from "./clip-processing"
import { ClipScrubber } from "./clip-scrubber"

type ClipPlayerProps = {
  clip: SnaccClip
  spoiler?: boolean
  snaccId?: string
  uploadProgress?: number
}

export function ClipPlayer({
  clip,
  spoiler,
  snaccId,
  uploadProgress,
}: ClipPlayerProps) {
  const { frame, video, ...player } = useInlineClip(clip.hls_url)
  const [revealed, setRevealed] = useState(false)

  if (!isReadyClip(clip)) {
    return <ClipProcessing clip={clip} uploadProgress={uploadProgress} />
  }

  const hidden = !!spoiler && !revealed

  return (
    <div
      ref={frame}
      onClick={(event) => event.stopPropagation()}
      className="group relative w-full overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: aspectRatio(clip) }}
    >
      <video
        {...video}
        poster={clip.poster_thumb_url ?? undefined}
        preload="none"
        loop
        playsInline
        disablePictureInPicture
        controlsList="nodownload noremoteplayback noplaybackrate"
        onContextMenu={(event) => event.preventDefault()}
        className={cn("size-full object-cover", hidden && "blur-2xl")}
      />

      {hidden ? (
        <button
          type="button"
          aria-label="Reveal sensitive content"
          onClick={() => {
            signal("spoiler_reveal", { subjectId: snaccId })
            setRevealed(true)
          }}
          className="absolute inset-0 cursor-pointer"
        >
          <SpoilerVeil />
        </button>
      ) : (
        <>
          <button
            type="button"
            aria-label={player.playing ? "Pause clip" : "Play clip"}
            onClick={player.toggle}
            className="absolute inset-0 cursor-pointer"
          >
            {player.playing ? null : (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-black/45 transition group-hover:bg-black/60">
                  {player.started ? (
                    <PauseIcon className="size-7 text-white" />
                  ) : (
                    <PlayIcon className="size-7 text-white" />
                  )}
                </span>
              </span>
            )}
          </button>

          <div className="pointer-events-none absolute right-2 bottom-2 left-2 flex items-center gap-2">
            {player.started ? (
              <ClipScrubber
                video={video.ref}
                enabled
                countdown
                durationMs={clip.duration_ms}
                className="pointer-events-auto flex-1"
              />
            ) : (
              <>
                <span className="rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
                  {clock(clip.duration_ms)}
                </span>
                <span className="flex-1" />
              </>
            )}

            <button
              type="button"
              aria-label={player.muted ? "Unmute clip" : "Mute clip"}
              onClick={player.toggleMute}
              className="pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/55"
            >
              {player.muted ? (
                <VolumeXIcon className="size-4 text-white" />
              ) : (
                <Volume2Icon className="size-4 text-white" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
