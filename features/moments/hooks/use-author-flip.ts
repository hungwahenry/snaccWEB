"use client"

import { useCallback, useRef } from "react"

const HALF_MS = 190
const PERSPECTIVE = 900

export type FlipDirection = "forward" | "back"

export function useAuthorFlip() {
  const page = useRef<HTMLDivElement>(null)
  const turning = useRef<number | null>(null)

  const flip = useCallback((direction: FlipDirection, commit: () => void) => {
    if (turning.current !== null) window.clearTimeout(turning.current)

    const element = page.current
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (element && !reduced) {
      const out = direction === "forward" ? -90 : 90
      element.style.transformOrigin =
        direction === "forward" ? "left center" : "right center"
      element.animate(
        [
          { transform: `perspective(${PERSPECTIVE}px) rotateY(0deg)` },
          {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${out}deg)`,
            offset: 0.5,
            easing: "ease-in",
          },
          {
            transform: `perspective(${PERSPECTIVE}px) rotateY(${-out}deg)`,
            offset: 0.5,
          },
          { transform: `perspective(${PERSPECTIVE}px) rotateY(0deg)` },
        ],
        { duration: HALF_MS * 2, easing: "ease-out" }
      )
    }

    turning.current = window.setTimeout(() => {
      turning.current = null
      commit()
    }, HALF_MS)
  }, [])

  return { pageRef: page, flip }
}
