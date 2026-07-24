"use client"

import { useEffect, useState } from "react"
import { detectStore, type StoreTarget } from "./store-links"

export function StoreBanner() {
  const [store, setStore] = useState<StoreTarget | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const target = detectStore(navigator.userAgent)
    if (!target) return
    setStore(target)

    const onScroll = () => {
      if (window.scrollY > 350) {
        setShown(true)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!store) return null

  return (
    <a
      href={store.href}
      className={`bg-foreground text-background fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-lg transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {store.label}
    </a>
  )
}
