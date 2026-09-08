"use client"

import { useNow } from "@/hooks/use-now"

export function useTransferCountdown(expiresAt: string) {
  const now = useNow(1000)
  const left = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - now) / 1000)
  )

  const hours = Math.floor(left / 3600)
  const minutes = Math.floor((left % 3600) / 60)
  const label =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}:${`${left % 60}`.padStart(2, "0")}`

  return { expired: left === 0, label }
}
