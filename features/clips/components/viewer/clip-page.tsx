"use client"

import { PlayIcon } from "lucide-react"
import { ReactionBursts } from "@/components/motion/reaction-bursts"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/ui/progress-ring"
import { SpoilerVeil } from "@/features/snaccs/components/card/media/spoiler-veil"
import { cn } from "@/lib/utils"
import { useClipPage } from "../../hooks/viewer/use-clip-page"
import type { ClipPageHandlers, ClipPlayback } from "../../types"
import type { PlayableClip } from "../../utils/viewer"
import { ClipScrubber } from "../clip-scrubber"
import { ClipCaption } from "./clip-caption"
import { ClipRail } from "./clip-rail"

type ClipPageProps = {
  snacc: PlayableClip | null
  top: number
  height: number
  handlers: ClipPageHandlers
  playback: ClipPlayback
}

export function ClipPage({
  snacc,
  top,
  height,
  handlers,
  playback,
}: ClipPageProps) {
  const page = useClipPage(snacc, handlers, playback)

  return (
    <section
      hidden={snacc === null}
      aria-label={page.label}
      style={{ top, height }}
      className="absolute inset-x-0 overflow-hidden"
    >
      <div
        {...page.gestures}
        className="absolute inset-0 touch-pan-y select-none"
      >
        <video
          {...page.video}
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noremoteplayback noplaybackrate"
          className={cn(
            "size-full object-contain transition-opacity duration-150",
            page.framed ? "opacity-100" : "opacity-0"
          )}
        />

        {page.veiled ? <SpoilerVeil /> : null}

        {page.center ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {page.center === "loading" ? (
              <ProgressRing progress={null} label="Loading clip" />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-black/45">
                <PlayIcon className="size-8 fill-white text-white" />
              </span>
            )}
          </span>
        ) : null}

        {page.fast ? (
          <span className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-sm font-bold text-white">
            2× speed
          </span>
        ) : null}

        <ReactionBursts bursts={page.bursts} onDone={page.clearBurst} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-black/70 to-transparent" />

      {page.failed ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="font-bold text-white">This clip would not play.</p>
          <Button
            variant="secondary"
            className="pointer-events-auto rounded-full"
            onClick={page.onRetry}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {snacc && page.rail ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 pb-[max(env(safe-area-inset-bottom),10px)]">
          <div className="flex items-end gap-3 pr-2 pl-4">
            <div className="pointer-events-auto min-w-0 flex-1">
              <ClipCaption snacc={snacc} />
            </div>
            <div className="pointer-events-auto">
              <ClipRail {...page.rail} />
            </div>
          </div>
          <div className="pointer-events-auto px-4">
            <ClipScrubber {...page.scrub} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
