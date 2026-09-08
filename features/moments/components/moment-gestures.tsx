"use client"

import { useCallback, useEffect, useRef, type PointerEvent } from "react"

const CLOSE_AT = 110
const SWITCH_AT = 60
const SLOP = 12
const HOLD_MS = 180

export function MomentGestures({
  onForward,
  onBack,
  onHold,
  onRelease,
  onClose,
  onNextAuthor,
  onPreviousAuthor,
}: {
  onForward: () => void
  onBack: () => void
  onHold: () => void
  onRelease: () => void
  onClose: () => void
  onNextAuthor: () => void
  onPreviousAuthor: () => void
}) {
  const start = useRef<{ x: number; y: number; at: number } | null>(null)
  const holdTimer = useRef<number | null>(null)
  const holding = useRef(false)
  const panned = useRef(false)

  const stopHolding = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    if (holding.current) {
      holding.current = false
      onRelease()
    }
  }, [onRelease])

  useEffect(() => () => stopHolding(), [stopHolding])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") onForward()
      else if (event.key === "ArrowLeft") onBack()
      else if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onForward, onBack, onClose])

  function down(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = { x: event.clientX, y: event.clientY, at: Date.now() }
    panned.current = false
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null
      holding.current = true
      onHold()
    }, HOLD_MS)
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const origin = start.current
    if (!origin || panned.current) return
    if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > SLOP) {
      panned.current = true
      stopHolding()
    }
  }

  function up(event: PointerEvent<HTMLDivElement>) {
    const origin = start.current
    start.current = null
    if (!origin) return

    const wasHolding = holding.current
    stopHolding()

    const dx = event.clientX - origin.x
    const dy = event.clientY - origin.y

    if (panned.current) {
      if (dy > CLOSE_AT && dy > Math.abs(dx)) {
        onClose()
        return
      }
      if (Math.abs(dx) < SWITCH_AT) return
      if (dx < 0) onNextAuthor()
      else onPreviousAuthor()
      return
    }

    if (wasHolding || Date.now() - origin.at > HOLD_MS) return

    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX - bounds.left < bounds.width / 3) onBack()
    else onForward()
  }

  function cancel() {
    start.current = null
    stopHolding()
  }

  return (
    <div
      className="absolute inset-0 touch-none select-none [-webkit-touch-callout:none]"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
    />
  )
}
