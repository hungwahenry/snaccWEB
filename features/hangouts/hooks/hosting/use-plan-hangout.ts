"use client"

import { useRouter } from "next/navigation"
import { composePath } from "@/features/snaccs/routes"
import { showError } from "@/lib/feedback"
import { useHangoutGate } from "@/providers/hangout-gate-provider"
import { useCanHost } from "./use-can-host"

export function usePlanHangout(): (() => void) | undefined {
  const router = useRouter()
  const enabled = useCanHost()
  const ensureAgreed = useHangoutGate()

  if (!enabled) return undefined

  return () =>
    void ensureAgreed()
      .then((agreed) => {
        if (agreed) router.push(composePath({ newHangout: true }))
      })
      .catch(showError)
}
