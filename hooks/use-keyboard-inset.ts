"use client"

import { useEffect, useState } from "react"

/// Below this a change is the browser's own chrome collapsing on scroll, not a keyboard, and
/// reacting to it would make a pinned bar jitter.
const KEYBOARD_MIN = 60

/// How much of the page the on-screen keyboard is covering. Zero on a desktop, and zero wherever
/// the browser resizes the page for the keyboard itself.
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const read = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop
      setInset(covered < KEYBOARD_MIN ? 0 : Math.round(covered))
    }

    read()
    viewport.addEventListener("resize", read)
    viewport.addEventListener("scroll", read)
    return () => {
      viewport.removeEventListener("resize", read)
      viewport.removeEventListener("scroll", read)
    }
  }, [])

  return inset
}
