"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function NavigationProgress() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const route = search ? `${pathname}?${search}` : pathname

  const [startedAt, setStartedAt] = useState<string | null>(null)
  if (startedAt !== null && startedAt !== route) setStartedAt(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return

      const link = (event.target as Element | null)?.closest?.("a")
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
        return
      if (link.hasAttribute("download")) return

      const href = link.getAttribute("href")
      if (!href || href.startsWith("#")) return

      const next = new URL(link.href, window.location.href)
      if (next.origin !== window.location.origin) return
      if (
        next.pathname + next.search ===
        window.location.pathname + window.location.search
      )
        return

      setStartedAt(route)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [route])

  if (startedAt === null) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
    >
      <div className="h-full w-2/5 animate-[nav-progress_1.1s_ease-in-out_infinite] bg-primary" />
    </div>
  )
}
