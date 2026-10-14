"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { getDueNudges } from "../api"
import { nudgeShown } from "../cache"
import type { NudgeKey } from "../types"
import { nudgeKeys } from "../utils/keys"

let turnTaken = false

export function useDueNudges() {
  return useQuery({
    queryKey: nudgeKeys.due(),
    queryFn: getDueNudges,
    staleTime: Infinity,
  })
}

export function useNudge(
  key: NudgeKey,
  eligible: boolean,
  show: () => void
): void {
  const due = useDueNudges().data?.includes(key) ?? false
  const shown = useRef(false)

  useEffect(() => {
    if (shown.current || !due || !eligible || turnTaken) return

    turnTaken = true
    shown.current = true
    show()
    nudgeShown(key)
  }, [key, due, eligible, show])
}
