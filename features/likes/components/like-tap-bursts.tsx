"use client"

import { useEffect, useRef } from "react"
import type { Burst } from "../types"
import { LIKE_BURST_MS, LikeBurst } from "./like-burst"

const FADE_MS = 250

type LikeTapBurstsProps = {
  bursts: readonly Burst[]
  size: number
  onDone: (id: number) => void
}

export function LikeTapBursts({ bursts, size, onDone }: LikeTapBurstsProps) {
  return bursts.map((burst) => (
    <TapBurst
      key={burst.id}
      x={burst.x}
      y={burst.y}
      size={size}
      onDone={() => onDone(burst.id)}
    />
  ))
}

type TapBurstProps = {
  x: number
  y: number
  size: number
  onDone: () => void
}

function TapBurst({ x, y, size, onDone }: TapBurstProps) {
  const node = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const animation = node.current?.animate(
      [
        { offset: 0, opacity: 1 },
        { offset: (LIKE_BURST_MS - FADE_MS) / LIKE_BURST_MS, opacity: 1 },
        { offset: 1, opacity: 0 },
      ],
      { duration: LIKE_BURST_MS, fill: "forwards" }
    )

    return () => animation?.cancel()
  }, [])

  return (
    <span
      ref={node}
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }}
    >
      <LikeBurst liked size={size} onDone={onDone} />
    </span>
  )
}
