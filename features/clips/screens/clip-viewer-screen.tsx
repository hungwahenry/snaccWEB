"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/ui/progress-ring"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { cn } from "@/lib/utils"
import { ClipPage } from "../components/viewer/clip-page"
import { ClipPoster } from "../components/viewer/clip-poster"
import { ClipsEnd } from "../components/viewer/clips-end"
import { useClipViewer } from "../hooks/viewer/use-clip-viewer"
import type { ClipPlayback } from "../types"

const IDLE: ClipPlayback = {
  active: false,
  playing: false,
  paused: false,
  fast: false,
  muted: true,
  veiled: false,
}

type ClipViewerScreenProps = {
  startId: string
  revealed: boolean
}

function MediaButton({
  icon: Icon,
  label,
  disabled,
  onPress,
  className,
}: {
  icon: LucideIcon
  label: string
  disabled?: boolean
  onPress: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        "pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/60 active:scale-95 disabled:cursor-default disabled:opacity-30",
        className
      )}
    >
      <Icon className="size-5" />
    </button>
  )
}

export function ClipViewerScreen({ startId, revealed }: ClipViewerScreenProps) {
  const { measure, scroller, ...viewer } = useClipViewer(startId, revealed)
  const { queue, pageHeight, handlers } = viewer

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div
        ref={measure}
        className="relative mx-auto h-full w-full md:max-w-[calc(100dvh*9/16)]"
      >
        {viewer.state === "ready" && pageHeight > 0 ? (
          <div
            ref={scroller}
            onScroll={viewer.onScroll}
            className="h-full snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative">
              {queue.map((snacc) => (
                <ClipPoster
                  key={snacc.id}
                  clip={snacc.clip}
                  height={pageHeight}
                  veiled={viewer.isVeiled(snacc)}
                />
              ))}

              {viewer.ending ? (
                <ClipsEnd
                  height={pageHeight}
                  failed={viewer.ending === "failed"}
                  onRetry={viewer.retryStream}
                  onClose={viewer.close}
                />
              ) : null}

              {viewer.live.map((page, slot) => {
                const snacc = page === null ? null : (queue[page] ?? null)

                return (
                  <ClipPage
                    key={slot}
                    snacc={snacc}
                    top={(page ?? 0) * pageHeight}
                    height={pageHeight}
                    handlers={handlers}
                    playback={
                      snacc && page !== null
                        ? viewer.playbackFor(page, snacc)
                        : IDLE
                    }
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
            {viewer.state === "loading" || viewer.state === "ready" ? (
              <ProgressRing progress={null} size="lg" label="Loading clips" />
            ) : (
              <>
                <p className="text-lg font-extrabold text-white">
                  {viewer.state === "failed"
                    ? "Could not load clips"
                    : "No clips to watch yet"}
                </p>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={
                    viewer.state === "failed"
                      ? viewer.retryStream
                      : viewer.close
                  }
                >
                  {viewer.state === "failed" ? "Try again" : "Back to feed"}
                </Button>
              </>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
          <MediaButton
            icon={XIcon}
            label="Close clips"
            onPress={viewer.close}
          />
          <MediaButton
            icon={viewer.muted ? VolumeXIcon : Volume2Icon}
            label={viewer.muted ? "Turn the sound on" : "Mute"}
            onPress={viewer.toggleMute}
          />
        </div>

        {viewer.soundBlocked ? (
          <button
            type="button"
            onClick={viewer.toggleMute}
            className="absolute top-[calc(env(safe-area-inset-top)+68px)] left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-black shadow-lg active:scale-95"
          >
            <VolumeXIcon className="size-4" /> Tap for sound
          </button>
        ) : null}
      </div>

      <div className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <MediaButton
          icon={ChevronUpIcon}
          label="Previous clip"
          disabled={!viewer.canStep.previous}
          onPress={() => viewer.step(-1)}
          className="size-12 bg-white/10 hover:bg-white/20"
        />
        <MediaButton
          icon={ChevronDownIcon}
          label="Next clip"
          disabled={!viewer.canStep.next}
          onPress={() => viewer.step(1)}
          className="size-12 bg-white/10 hover:bg-white/20"
        />
      </div>

      <SnaccSheets {...viewer.sheets} />
    </div>
  )
}
