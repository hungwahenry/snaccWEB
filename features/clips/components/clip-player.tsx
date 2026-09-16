"use client"

import { useState } from "react"
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from "lucide-react"
import { ProgressRing } from "@/components/ui/progress-ring"
import { signal } from "@/features/signals/utils/queue"
import { clock } from "@/features/voice/utils/clock"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import type { SnaccClip } from "../../snaccs/types"
import { SpoilerVeil } from "../../snaccs/components/card/media/spoiler-veil"
import { useStreamedVideo } from "../hooks/use-streamed-video"
import { clipStatusLabel, isUploading } from "../utils/clips"

export function ClipPlayer({
  clip,
  spoiler,
  snaccId,
  uploadProgress,
}: {
  clip: SnaccClip
  spoiler?: boolean
  snaccId?: string
  uploadProgress?: number
}) {
  const { ref: video, play } = useStreamedVideo(clip.hls_url)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (clip.status !== "ready") {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-muted"
        style={{ aspectRatio: aspectRatio(clip) }}
      >
        {clip.poster_thumb_url ? (
          <img
            src={clip.poster_thumb_url}
            alt=""
            className="size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35">
          <ProgressRing
            progress={isUploading(uploadProgress) ? uploadProgress : null}
            size="lg"
            label={clipStatusLabel(uploadProgress)}
          />
          <span className="text-xs font-bold text-white">
            {clipStatusLabel(uploadProgress)}
          </span>
        </div>
      </div>
    )
  }

  const hidden = !!spoiler && !revealed
  const duration = clip.duration_ms / 1000

  function toggle() {
    const element = video.current
    if (!element) return
    if (element.paused) void play()
    else element.pause()
  }

  return (
    // Playing a clip is not opening the snacc it sits in.
    <div
      onClick={(event) => event.stopPropagation()}
      className="group relative w-full overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: aspectRatio(clip) }}
    >
      {/* Mounted up front, and only fetched on demand: a <video> created inside the click
          handler loses the gesture browsers require to play with sound. */}
      <video
        ref={video}
        poster={clip.poster_thumb_url ?? undefined}
        preload="none"
        loop
        playsInline
        muted={muted}
        disablePictureInPicture
        controlsList="nodownload noremoteplayback noplaybackrate"
        onContextMenu={(event) => event.preventDefault()}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
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
            aria-label={playing ? "Pause clip" : "Play clip"}
            onClick={() => {
              if (!started) setStarted(true)
              toggle()
            }}
            className="absolute inset-0 cursor-pointer"
          >
            {playing ? null : (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-black/45 transition group-hover:bg-black/60">
                  {started ? (
                    <PauseIcon className="size-7 text-white" />
                  ) : (
                    <PlayIcon className="size-7 text-white" />
                  )}
                </span>
              </span>
            )}
          </button>

          <div className="pointer-events-none absolute right-2 bottom-2 left-2 flex items-center gap-2">
            <span className="rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
              {clock(
                started
                  ? Math.max(0, duration - elapsed) * 1000
                  : clip.duration_ms
              )}
            </span>

            {started ? (
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                <span
                  className="block h-full rounded-full bg-white"
                  style={{
                    width: `${duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0}%`,
                  }}
                />
              </span>
            ) : (
              <span className="flex-1" />
            )}

            <button
              type="button"
              aria-label={muted ? "Unmute clip" : "Mute clip"}
              onClick={() => setMuted((on) => !on)}
              className="pointer-events-auto flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/55"
            >
              {muted ? (
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
