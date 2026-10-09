"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { nextChrome, RESTING_CHROME } from "@/lib/scroll-chrome"

export function useHiddenOnScroll(): boolean {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let state = RESTING_CHROME
    const read = () => {
      state = nextChrome(state, window.scrollY)
      setHidden(state.hidden)
    }
    read()
    window.addEventListener("scroll", read, { passive: true })
    return () => window.removeEventListener("scroll", read)
  }, [pathname])

  return hidden
}
