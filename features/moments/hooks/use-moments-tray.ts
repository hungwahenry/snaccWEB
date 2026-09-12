"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { getTray } from "../api"
import { MOMENTS_TRAY_KEY } from "../utils/keys"
import { soonestExpiry } from "../utils/queue"

const EXPIRY_GRACE_MS = 1_000

export function useMomentsTray() {
  const enabled = useFlag("moments")
  const queryClient = useQueryClient()

  const tray = useQuery({
    queryKey: MOMENTS_TRAY_KEY,
    queryFn: getTray,
    enabled,
    staleTime: 30_000,
  })

  const soonest = tray.data ? soonestExpiry(tray.data) : null
  useEffect(() => {
    if (soonest === null) return

    const timer = window.setTimeout(
      () => void queryClient.invalidateQueries({ queryKey: MOMENTS_TRAY_KEY }),
      Math.max(soonest - Date.now(), 0) + EXPIRY_GRACE_MS
    )
    return () => window.clearTimeout(timer)
  }, [soonest, queryClient])

  return tray
}
