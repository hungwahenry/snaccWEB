"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { usePremiumFeature } from "@/features/premium/hooks/use-premium"
import { showSuccess } from "@/lib/feedback"
import { newId } from "@/lib/ids"
import { scheduleSnacc } from "../../api"
import { draftToInput } from "../../cache/optimistic-snacc"
import { scheduledChanged } from "../../cache/scheduled"
import type { SnaccDraft } from "../../types"
import { goesOutLabel, goesOutSentence } from "../../utils/schedule"
import { useSchedulePicker } from "../scheduled/use-schedule-picker"

export function useComposerSchedule({
  shown,
  allowed,
}: {
  shown: boolean
  allowed: boolean
}) {
  const enabled = usePremiumFeature("scheduled_posts")
  const picker = useSchedulePicker()
  const [publishAt, setPublishAt] = useState<Date | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [id] = useState(newId)
  const schedule = useMutation({
    mutationFn: scheduleSnacc,
    onSuccess: (item) => {
      scheduledChanged()
      showSuccess(`Scheduled for ${goesOutLabel(item.publish_at)}`)
    },
  })

  const available = enabled && shown
  const usable = available && allowed
  const active = usable && publishAt !== null
  const tooSoon = publishAt !== null && picker.isTooSoon(publishAt)

  function submit(draft: SnaccDraft, onDone: () => void) {
    if (!publishAt || schedule.isPending || tooSoon) return
    schedule.mutate(
      { ...draftToInput(id, draft), publishAt: publishAt.toISOString() },
      { onSuccess: onDone }
    )
  }

  return {
    available,
    usable,
    active,
    busy: schedule.isPending,
    ready: !active || (!tooSoon && !schedule.isPending),
    summary: publishAt
      ? `Goes out ${goesOutSentence(publishAt.toISOString())}`
      : "",
    problem: tooSoon ? picker.tooSoonText : null,
    open: () => {
      picker.start(publishAt ?? undefined)
      setSheetOpen(true)
    },
    clear: () => setPublishAt(null),
    sheet: {
      open: sheetOpen,
      onOpenChange: setSheetOpen,
      picker: {
        ...picker.props,
        confirmLabel: "Done",
        onConfirm: () => {
          setPublishAt(picker.value)
          setSheetOpen(false)
        },
      },
    },
    submit,
  }
}
