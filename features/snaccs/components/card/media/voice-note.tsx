"use client"

import { PauseIcon, PlayIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function clock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

export function VoiceNote({
  url,
  durationMs,
  tone = "default",
}: {
  url: string
  durationMs: number
  tone?: "default" | "inverted"
}) {
  const inverted = tone === "inverted"
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const element = new Audio(url)
    audio.current = element
    const onTime = () => setPosition(element.currentTime * 1000)
    const onEnd = () => {
      setPlaying(false)
      setPosition(0)
    }
    element.addEventListener("timeupdate", onTime)
    element.addEventListener("ended", onEnd)
    return () => {
      element.pause()
      element.removeEventListener("timeupdate", onTime)
      element.removeEventListener("ended", onEnd)
      audio.current = null
    }
  }, [url])

  function toggle(event: React.MouseEvent) {
    event.stopPropagation()
    const element = audio.current
    if (!element) return
    if (playing) {
      element.pause()
      setPlaying(false)
    } else {
      void element.play()
      setPlaying(true)
    }
  }

  const progress = durationMs > 0 ? Math.min(1, position / durationMs) : 0

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2",
        inverted ? "bg-background/15" : "border border-border"
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          inverted
            ? "bg-background text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {playing ? (
          <PauseIcon className="size-4" />
        ) : (
          <PlayIcon className="size-4" />
        )}
      </button>
      <div
        className={cn(
          "h-1.5 flex-1 overflow-hidden rounded-full",
          inverted ? "bg-background/30" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",
            inverted ? "bg-background" : "bg-foreground"
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-bold tabular-nums",
          inverted ? "text-primary-foreground/70" : "text-muted-foreground"
        )}
      >
        {clock(playing ? position : durationMs)}
      </span>
    </div>
  )
}
