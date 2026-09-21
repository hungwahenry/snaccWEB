"use client"

import { useRouter } from "next/navigation"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGhostWindow } from "@/features/ghost/hooks/use-ghost-window"
import { composePath } from "@/features/snaccs/routes"
import { showError } from "@/lib/feedback"
import { useHangoutGate } from "@/providers/hangout-gate-provider"

export function usePlanHangout(): (() => void) | undefined {
  const router = useRouter()
  const enabled = useFlag("hangouts")
  const ghost = useGhostWindow()
  const ensureAgreed = useHangoutGate()

  if (!enabled || ghost.active) return undefined

  return () =>
    void ensureAgreed()
      .then((agreed) => {
        if (agreed) router.push(composePath({ newHangout: true }))
      })
      .catch(showError)
}
