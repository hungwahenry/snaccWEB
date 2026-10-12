"use client"

import { useState } from "react"
import { useDateTimePicker } from "@/hooks/use-date-time-picker"
import { useNow } from "@/hooks/use-now"
import { roundUpToStep } from "@/lib/calendar"
import { HOUR_MS } from "@/lib/duration"
import { dateAtTime } from "@/lib/format"
import type { CampaignDraft, DraftLimits, ScheduleEnd } from "../types"
import { SLOT_MINUTES } from "../utils/campaigns"
import { scheduleBounds } from "../utils/draft"

const TICK_MS = 30_000

type Schedule = Pick<CampaignDraft, "startsAt" | "endsAt">

export function useCampaignSchedule(
  schedule: Schedule,
  limits: Pick<DraftLimits, "maxDays" | "maxLeadDays">,
  onPick: (patch: Partial<Schedule>) => void
) {
  const now = useNow(TICK_MS)
  const [editing, setEditing] = useState<ScheduleEnd>("start")
  const [open, setOpen] = useState(false)
  const bounds = scheduleBounds(editing, schedule.startsAt, now, limits)
  const picker = useDateTimePicker({
    initial: () => new Date(schedule.endsAt),
    min: bounds.min,
    max: bounds.max,
    minuteStep: SLOT_MINUTES,
  })
  const picked = picker.value.toISOString()

  function edit(end: ScheduleEnd) {
    const from =
      end === "end"
        ? new Date(schedule.endsAt)
        : schedule.startsAt
          ? new Date(schedule.startsAt)
          : roundUpToStep(new Date(Date.now() + HOUR_MS), SLOT_MINUTES)
    setEditing(end)
    picker.reset(from)
    setOpen(true)
  }

  return {
    fields: {
      start: schedule.startsAt ? dateAtTime(schedule.startsAt) : "Right away",
      end: dateAtTime(schedule.endsAt),
      onEditStart: () => edit("start"),
      onEditEnd: () => edit("end"),
      onStartNow: schedule.startsAt
        ? () => onPick({ startsAt: null })
        : undefined,
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      title: editing === "start" ? "Starts" : "Ends",
      picker: {
        ...picker.props,
        summary: dateAtTime(picked),
        problem: picker.tooSoon
          ? editing === "start"
            ? "Pick a time from now on."
            : "Pick a time after the start."
          : null,
        confirmLabel: "Done",
        onConfirm: () => {
          onPick(
            editing === "start" ? { startsAt: picked } : { endsAt: picked }
          )
          setOpen(false)
        },
      },
    },
  }
}
