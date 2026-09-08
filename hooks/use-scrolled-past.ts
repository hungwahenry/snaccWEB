"use client"

import { useEffect, useState } from "react"

/// True once the page has scrolled past a threshold, for headers that fade in over content.
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const read = () => setPast(window.scrollY > threshold)
    read()
    window.addEventListener("scroll", read, { passive: true })
    return () => window.removeEventListener("scroll", read)
  }, [threshold])

  return past
}
