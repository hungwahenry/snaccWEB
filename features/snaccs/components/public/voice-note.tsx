"use client"

import { PauseIcon, PlayIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function clock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

export function VoiceNote({
  url,
  durationMs,
}: {
  url: string
  durationMs: number
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  function toggle() {
    let audio = audioRef.current
    if (!audio) {
      audio = new Audio(url)
      audio.addEventListener("timeupdate", () =>
        setElapsedMs(audio!.currentTime * 1000)
      )
      audio.addEventListener("ended", () => {
        setPlaying(false)
        setElapsedMs(0)
      })
      audioRef.current = audio
    }

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      void audio.play()
      setPlaying(true)
    }
  }

  const progress = durationMs > 0 ? Math.min(1, elapsedMs / durationMs) : 0

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border px-3 py-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted transition-opacity hover:opacity-70"
      >
        {playing ? (
          <PauseIcon className="text-foreground" size={16} />
        ) : (
          <PlayIcon className="text-foreground" size={16} />
        )}
      </button>

      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/20">
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
        {clock(playing || elapsedMs > 0 ? elapsedMs : durationMs)}
      </span>
    </div>
  )
}
