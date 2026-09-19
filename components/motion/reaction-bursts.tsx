"use client"

import { useEffect, useRef } from "react"

const BURST_MS = 750
const BURST_SIZE = 96
const BURST_RISE = 60
const EASE_OUT = "cubic-bezier(0.33, 1, 0.68, 1)"

const RISING: Keyframe[] = [
  { offset: 0, opacity: 0, transform: "translateY(0) scale(0.3)" },
  { offset: 0.1, opacity: 1 },
  {
    offset: 0.15,
    transform: `translateY(${-0.15 * BURST_RISE}px) scale(1.25)`,
  },
  { offset: 0.3, transform: `translateY(${-0.3 * BURST_RISE}px) scale(1)` },
  { offset: 0.75, opacity: 1 },
  {
    offset: 1,
    opacity: 0,
    transform: `translateY(${-BURST_RISE}px) scale(1.1)`,
  },
]

const FADING: Keyframe[] = [
  { offset: 0, opacity: 0 },
  { offset: 0.1, opacity: 1 },
  { offset: 0.75, opacity: 1 },
  { offset: 1, opacity: 0 },
]

export interface Burst {
  id: number
  emoji: string
  x: number
  y: number
}

type ReactionBurstsProps = {
  bursts: readonly Burst[]
  onDone: (id: number) => void
}

export function ReactionBursts({ bursts, onDone }: ReactionBurstsProps) {
  return bursts.map((burst) => (
    <ReactionBurst
      key={burst.id}
      emoji={burst.emoji}
      x={burst.x}
      y={burst.y}
      onDone={() => onDone(burst.id)}
    />
  ))
}

type ReactionBurstProps = {
  emoji: string
  x: number
  y: number
  onDone: () => void
}

export function ReactionBurst({ emoji, x, y, onDone }: ReactionBurstProps) {
  const element = useRef<HTMLSpanElement>(null)
  const done = useRef(onDone)

  useEffect(() => {
    done.current = onDone
  })

  useEffect(() => {
    const node = element.current
    if (!node) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const animation = node.animate(reduced ? FADING : RISING, {
      duration: BURST_MS,
      easing: EASE_OUT,
      fill: "forwards",
    })
    animation.onfinish = () => done.current()

    return () => animation.cancel()
  }, [])

  return (
    <span
      ref={element}
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center opacity-0"
      style={{
        left: x - BURST_SIZE / 2,
        top: y - BURST_SIZE / 2,
        width: BURST_SIZE,
        height: BURST_SIZE,
        fontSize: BURST_SIZE * 0.75,
        lineHeight: 1,
      }}
    >
      {emoji}
    </span>
  )
}
