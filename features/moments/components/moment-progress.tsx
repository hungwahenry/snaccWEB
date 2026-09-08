"use client"

import { useEffect, useRef } from "react"
import type { MomentClock } from "../hooks/use-moment-clock"

export function MomentProgress({
  count,
  index,
  clock,
}: {
  count: number
  index: number
  clock: MomentClock
}) {
  return (
    <div className="flex gap-1 px-3">
      {Array.from({ length: count }, (_, at) => (
        <span
          key={at}
          className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
        >
          {at < index ? (
            <span className="block h-full w-full rounded-full bg-white" />
          ) : at === index ? (
            <RunningBar clock={clock} />
          ) : null}
        </span>
      ))}
    </div>
  )
}

/// Animates itself from the clock's snapshot, so a pause freezes exactly where the card is.
function RunningBar({ clock }: { clock: MomentClock }) {
  const bar = useRef<HTMLSpanElement>(null)
  const { running, restartKey, duration, snapshot } = clock

  useEffect(() => {
    const element = bar.current
    if (!element) return

    const { from, remaining } = snapshot()
    const animation = element.animate(
      [{ width: `${from * 100}%` }, { width: "100%" }],
      { duration: Math.max(remaining, 1), easing: "linear", fill: "forwards" }
    )
    if (!running) animation.pause()

    return () => animation.cancel()
  }, [running, restartKey, duration, snapshot])

  return <span ref={bar} className="block h-full rounded-full bg-white" />
}
