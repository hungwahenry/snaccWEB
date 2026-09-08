"use client"

import { MicIcon } from "lucide-react"
import { useRef, type PointerEvent } from "react"
import { cn } from "@/lib/utils"

export const CANCEL_DISTANCE = 90

type VoiceRecordButtonProps = {
  recording: boolean
  onStart: () => void
  onSlide: (translationX: number) => void
  onFinish: (cancelled: boolean) => void
  disabled?: boolean
}

export function VoiceRecordButton({
  recording,
  onStart,
  onSlide,
  onFinish,
  disabled = false,
}: VoiceRecordButtonProps) {
  const origin = useRef<number | null>(null)
  const slid = useRef(0)

  function down(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    origin.current = event.clientX
    slid.current = 0
    onSlide(0)
    onStart()
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (origin.current === null) return
    slid.current = Math.min(0, event.clientX - origin.current)
    onSlide(slid.current)
  }

  function up() {
    if (origin.current === null) return
    origin.current = null
    const cancelled = slid.current <= -CANCEL_DISTANCE
    onSlide(0)
    onFinish(cancelled)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="Hold to record a voice note"
      aria-busy={recording}
      className={cn(
        "flex size-11 shrink-0 touch-none items-center justify-center rounded-full transition-transform select-none",
        recording
          ? "scale-115 bg-destructive text-background"
          : "bg-primary text-primary-foreground",
        disabled && "opacity-40"
      )}
    >
      <MicIcon className="size-6" />
    </button>
  )
}
