"use client"

import { useEffect } from "react"
import { hideOffline, showOffline } from "@/lib/feedback"
import { useOnline } from "./use-online"

export function useOfflineNotice(): void {
  const online = useOnline()

  useEffect(() => {
    if (online) return
    showOffline()
    return hideOffline
  }, [online])
}
