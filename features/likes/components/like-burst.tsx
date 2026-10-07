"use client"

import { useEffect, useRef } from "react"
import { useLikeTheme } from "../hooks/use-like-theme"
import type { LikeGlyphProps, LikeTheme } from "../types"
import { LikeGlyph } from "./like-glyph"

export const LIKE_BURST_MS = 650

const REDUCED = "(prefers-reduced-motion: reduce)"
const EASE_OUT = "cubic-bezier(0.33, 1, 0.68, 1)"
const RING_SCALE = 1.9
const PARTICLE_COUNT = 8

const POP: Keyframe[] = [
  { offset: 0, transform: "scale(0.2)" },
  { offset: 0.35, transform: "scale(1.25)" },
  { offset: 0.6, transform: "scale(0.94)" },
  { offset: 0.8, transform: "scale(1.03)" },
  { offset: 1, transform: "scale(1)" },
]

const RING: Keyframe[] = [
  { offset: 0, opacity: 0, transform: "scale(0.35)" },
  { offset: 0.15, opacity: 1 },
  { offset: 0.55, opacity: 0, transform: "scale(1)" },
  { offset: 1, opacity: 0, transform: "scale(1)" },
]

const PATHS = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const angle = (index / PARTICLE_COUNT) * 2 * Math.PI - Math.PI / 2

  return { x: Math.cos(angle), y: Math.sin(angle), far: index % 2 === 0 }
})

type Path = (typeof PATHS)[number]

type LikeBurstProps = LikeGlyphProps & {
  onDone: () => void
}

export function LikeBurst({ liked, size, className, onDone }: LikeBurstProps) {
  const { Particle } = useLikeTheme()
  const glyph = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)
  const done = useRef(onDone)
  const ringSize = size * RING_SCALE

  useEffect(() => {
    done.current = onDone
  })

  useEffect(() => {
    const timer = window.setTimeout(() => done.current(), LIKE_BURST_MS)
    if (window.matchMedia(REDUCED).matches) {
      return () => window.clearTimeout(timer)
    }

    const animations = [
      glyph.current?.animate(POP, {
        duration: LIKE_BURST_MS,
        easing: "ease-out",
      }),
      ring.current?.animate(RING, {
        duration: LIKE_BURST_MS,
        easing: EASE_OUT,
        fill: "forwards",
      }),
    ]

    return () => {
      window.clearTimeout(timer)
      animations.forEach((animation) => animation?.cancel())
    }
  }, [])

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span
        ref={ring}
        className="absolute rounded-full border-like opacity-0"
        style={{
          width: ringSize,
          height: ringSize,
          left: (size - ringSize) / 2,
          top: (size - ringSize) / 2,
          borderWidth: Math.max(2, Math.round(size * 0.05)),
        }}
      />
      {PATHS.map((path, index) => (
        <Flight
          key={index}
          path={path}
          index={index}
          size={size}
          Particle={Particle}
        />
      ))}
      <span
        ref={glyph}
        className="absolute inset-0 flex items-center justify-center"
      >
        <LikeGlyph liked={liked} size={size} className={className} />
      </span>
    </span>
  )
}

type FlightProps = {
  path: Path
  index: number
  size: number
  Particle: LikeTheme["Particle"]
}

function Flight({ path, index, size, Particle }: FlightProps) {
  const node = useRef<HTMLSpanElement>(null)
  const piece = Math.round(size * (path.far ? 0.18 : 0.13))

  useEffect(() => {
    if (!node.current || window.matchMedia(REDUCED).matches) return

    const from = size * 0.45
    const to = size * (path.far ? 1.2 : 0.95)
    const at = (distance: number, scale: number) =>
      `translate(${path.x * distance}px, ${path.y * distance}px) scale(${scale})`

    const animation = node.current.animate(
      [
        { offset: 0, opacity: 0, transform: at(from, 1) },
        { offset: 0.1, opacity: 0, transform: at(from, 1) },
        { offset: 0.25, opacity: 1 },
        { offset: 1, opacity: 0, transform: at(to, 0.3) },
      ],
      { duration: LIKE_BURST_MS, easing: EASE_OUT, fill: "forwards" }
    )

    return () => animation.cancel()
  }, [path, size])

  return (
    <span
      ref={node}
      className="absolute flex items-center justify-center opacity-0"
      style={{
        width: piece,
        height: piece,
        left: (size - piece) / 2,
        top: (size - piece) / 2,
      }}
    >
      <Particle size={piece} index={index} />
    </span>
  )
}
