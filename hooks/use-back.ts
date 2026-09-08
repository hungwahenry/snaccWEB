"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useBack(fallback = "/home") {
  const router = useRouter()

  return useCallback(() => {
    if (window.history.length > 1) router.back()
    else router.replace(fallback)
  }, [router, fallback])
}
