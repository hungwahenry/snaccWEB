"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useDateTimePicker } from "@/hooks/use-date-time-picker"
import { useNow } from "@/hooks/use-now"
import {
  goesOutSentence,
  isTooSoon,
  nextSlot,
  rescheduleSeed,
  scheduleWindow,
  SLOT_MINUTES,
  tooSoonMessage,
} from "../../utils/schedule"

const TICK_MS = 30_000

export function useSchedulePicker() {
  const minLead = useConfigValue("content.scheduled.min_lead_minutes")
  const maxDays = useConfigValue("content.scheduled.max_lead_days")
  const now = useNow(TICK_MS)
  const range = scheduleWindow(new Date(now), minLead, maxDays)
  const picker = useDateTimePicker({
    initial: () => nextSlot(new Date()),
    min: range.min,
    max: range.max,
    minuteStep: SLOT_MINUTES,
  })
  const tooSoonText = tooSoonMessage(minLead)

  return {
    value: picker.value,
    tooSoonText,
    isTooSoon: (at: Date) => isTooSoon(at, new Date(now), minLead),
    start: (from?: Date) => picker.reset(from ?? nextSlot(new Date())),
    startFrom: (publishAt: string) =>
      picker.reset(rescheduleSeed(publishAt, new Date(), minLead)),
    props: {
      ...picker.props,
      summary: `Goes out ${goesOutSentence(picker.value.toISOString())}`,
      problem: picker.tooSoon ? tooSoonText : null,
    },
  }
}
