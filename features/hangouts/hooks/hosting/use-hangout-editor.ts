"use client"

import { useNow } from "@/hooks/use-now"
import type { HangoutDraft, HangoutLimits } from "../../types"
import { checkHangout, clampCapacity } from "../../utils/hangout-draft"
import { useHangoutTime } from "./use-hangout-time"

const TICK_MS = 30_000

export function useHangoutEditor(
  draft: HangoutDraft | null,
  limits: HangoutLimits,
  onChange: (patch: Partial<HangoutDraft>) => void,
  keptStart: string | null = null
) {
  const now = useNow(TICK_MS)
  const { valid, timeProblem } = checkHangout(draft, limits, now, keptStart)
  const time = useHangoutTime(draft?.startsAt ?? null, limits, (startsAt) =>
    onChange({ startsAt })
  )

  return {
    now,
    valid,
    timeSheet: time.sheet,
    fields: {
      limits,
      time: time.label,
      timeProblem,
      onEditTime: time.edit,
      onChange,
      onCapacity: (by: number) => {
        if (draft)
          onChange({ capacity: clampCapacity(draft.capacity + by, limits) })
      },
    },
  }
}
