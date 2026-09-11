"use client"

import { useCallback, useRef, useState } from "react"

/**
 * Runs an async action with its own pending flag, so each row, button or dialog shows its own
 * progress instead of every control waiting on one shared mutation. Resolves true on success and
 * false on failure; the failure itself has already been reported by the mutation.
 */
export function usePendingAction<A extends unknown[]>(
  action: (...args: A) => Promise<unknown> | void
) {
  const [pending, setPending] = useState(false)
  const inFlight = useRef(false)

  const run = useCallback(
    async (...args: A): Promise<boolean> => {
      if (inFlight.current) return false
      inFlight.current = true
      setPending(true)
      try {
        await action(...args)
        return true
      } catch {
        return false
      } finally {
        inFlight.current = false
        setPending(false)
      }
    },
    [action]
  )

  return [pending, run] as const
}
