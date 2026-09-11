"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { HOME_PATH } from "@/features/feed/routes"

export function useBack(fallback = HOME_PATH) {
  const router = useRouter()

  return useCallback(() => {
    if (window.history.length > 1) router.back()
    else router.replace(fallback)
  }, [router, fallback])
}
