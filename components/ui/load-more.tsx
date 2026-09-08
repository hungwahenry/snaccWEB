"use client"

import { useEffect, useRef } from "react"

export function LoadMore({
  onReach,
  disabled = false,
}: {
  onReach: () => void
  disabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const saved = useRef(onReach)

  useEffect(() => {
    saved.current = onReach
  })

  useEffect(() => {
    const node = ref.current
    if (!node || disabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) saved.current()
      },
      { rootMargin: "600px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [disabled])

  return <div ref={ref} aria-hidden className="h-px" />
}
