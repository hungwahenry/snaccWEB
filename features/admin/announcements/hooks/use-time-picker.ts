"use client"

import { useState } from "react"
import type { DateTimePickerProps } from "@/components/ui/date-time-picker"
import { usePendingAction } from "@/features/admin/shell/hooks/use-pending-action"
import { useDateTimePicker } from "@/hooks/use-date-time-picker"
import { useNow } from "@/hooks/use-now"
import { roundUpToStep } from "@/lib/calendar"
import { DAY_MS, HOUR_MS, MINUTE_MS } from "@/lib/duration"

const TICK_MS = 30_000
const MINUTE_STEP = 5

const suggestedAt = (from: number, hours: number) =>
  roundUpToStep(new Date(from + hours * HOUR_MS), MINUTE_STEP)

export function useTimePicker({
  leadMinutes,
  aheadDays,
  suggestHours,
  confirmLabel,
  tooSoon,
  describe,
  onPick,
}: {
  leadMinutes: number
  aheadDays: number
  suggestHours: number
  confirmLabel: string
  tooSoon: string
  describe: (iso: string) => string
  onPick: (iso: string) => Promise<unknown> | void
}) {
  const now = useNow(TICK_MS)
  const [open, setOpen] = useState(false)
  const picker = useDateTimePicker({
    initial: () => suggestedAt(Date.now(), suggestHours),
    min: new Date(now + leadMinutes * MINUTE_MS),
    max: new Date(now + aheadDays * DAY_MS),
    minuteStep: MINUTE_STEP,
  })
  const [confirming, confirm] = usePendingAction(onPick)
  const picked = picker.value.toISOString()

  const props: DateTimePickerProps = {
    ...picker.props,
    summary: describe(picked),
    problem: picker.tooSoon ? tooSoon : null,
    confirmLabel,
    confirming,
    onConfirm: async () => {
      if (await confirm(picked)) setOpen(false)
    },
  }

  return {
    start: (from: string | null) => {
      const at = from ? Date.parse(from) : Number.NaN
      picker.reset(
        at > Date.now() ? new Date(at) : suggestedAt(Date.now(), suggestHours)
      )
      setOpen(true)
    },
    dialog: {
      open,
      onOpenChange: (next: boolean) => {
        if (!confirming) setOpen(next)
      },
      picker: props,
    },
  }
}
