"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { detectStore, type StoreTarget } from "./store-links"

let detected: StoreTarget | null | undefined

function readStore(): StoreTarget | null {
  if (detected === undefined) detected = detectStore(navigator.userAgent)
  return detected
}

const noChanges = () => () => {}

export function StoreBanner() {
  const store = useSyncExternalStore(noChanges, readStore, () => null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!store) return

    const onScroll = () => {
      if (window.scrollY > 350) {
        setShown(true)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [store])

  if (!store) return null

  return (
    <a
      href={store.href}
      className={`fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-center rounded-2xl bg-foreground px-5 py-3.5 text-sm font-semibold text-background shadow-lg transition-all duration-300 ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {store.label}
    </a>
  )
}
