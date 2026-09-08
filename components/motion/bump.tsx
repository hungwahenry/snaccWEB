"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

const BUMP_SCALE = 1.25
const BUMP_MS = 120

export function Bump({
  value,
  children,
  className,
}: {
  value: unknown
  children: ReactNode
  className?: string
}) {
  const element = useRef<HTMLSpanElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    element.current?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(" + BUMP_SCALE + ")" },
        { transform: "scale(1)" },
      ],
      { duration: BUMP_MS * 2, easing: "ease-in-out" }
    )
  }, [value])

  return (
    <span ref={element} className={cn("inline-flex", className)}>
      {children}
    </span>
  )
}
