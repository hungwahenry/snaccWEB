"use client"

import { MicIcon } from "lucide-react"
import { useRef, type KeyboardEvent, type PointerEvent } from "react"
import { cn } from "@/lib/utils"
import { slideCancels } from "../utils/recording"

type VoiceRecordButtonProps = {
  recording: boolean
  onStart: () => void
  onSlide: (translationX: number) => void
  onFinish: (cancelled: boolean) => void
  disabled?: boolean
}

function isHoldKey(key: string): boolean {
  return key === " " || key === "Enter"
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
  const keyHeld = useRef(false)

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
    onSlide(0)
    onFinish(slideCancels(slid.current))
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (keyHeld.current && event.key === "Escape") {
      event.preventDefault()
      keyHeld.current = false
      onFinish(true)
      return
    }
    if (!isHoldKey(event.key)) return
    event.preventDefault()
    if (event.repeat || keyHeld.current) return
    keyHeld.current = true
    onSlide(0)
    onStart()
  }

  function keyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (!isHoldKey(event.key) || !keyHeld.current) return
    event.preventDefault()
    keyHeld.current = false
    onFinish(false)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={keyDown}
      onKeyUp={keyUp}
      onBlur={() => {
        if (!keyHeld.current) return
        keyHeld.current = false
        onFinish(true)
      }}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="Hold to record a voice note"
      aria-pressed={recording}
      className={cn(
        "flex size-11 shrink-0 touch-none items-center justify-center rounded-full transition-transform outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        recording
          ? "scale-115 bg-destructive text-background"
          : "bg-primary text-primary-foreground",
        disabled && "opacity-40"
      )}
    >
      <MicIcon className="size-6" aria-hidden />
    </button>
  )
}
