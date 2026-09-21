"use client"

import { useState } from "react"
import { useDateTimePicker } from "@/hooks/use-date-time-picker"
import { useNow } from "@/hooks/use-now"
import { roundUpToStep } from "@/lib/calendar"
import { dateAtTime } from "@/lib/format"
import type { HangoutLimits } from "../../types"
import { timeProblem } from "../../utils/hangout-draft"

const TICK_MS = 30_000
const MINUTE_STEP = 5
const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

const suggestedStart = (now: number) =>
  roundUpToStep(new Date(now + HOUR_MS), MINUTE_STEP)

export function useHangoutTime(
  startsAt: string | null,
  limits: HangoutLimits,
  onPick: (startsAt: string) => void
) {
  const now = useNow(TICK_MS)
  const [open, setOpen] = useState(false)
  const picker = useDateTimePicker({
    initial: () => suggestedStart(Date.now()),
    min: new Date(now + limits.minLeadMinutes * MINUTE_MS),
    max: new Date(now + limits.maxAheadDays * DAY_MS),
    minuteStep: MINUTE_STEP,
  })
  const picked = picker.value.toISOString()
  const problem = timeProblem(picked, limits, now)

  return {
    label: startsAt ? dateAtTime(startsAt) : "Pick a time",
    edit: () => {
      picker.reset(startsAt ? new Date(startsAt) : suggestedStart(Date.now()))
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      picker: {
        ...picker.props,
        summary: dateAtTime(picked),
        problem,
        canConfirm: picker.props.canConfirm && problem === null,
        confirmLabel: "Done",
        onConfirm: () => {
          onPick(picked)
          setOpen(false)
        },
      },
    },
  }
}
