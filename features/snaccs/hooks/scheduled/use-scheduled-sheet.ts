"use client"

import { useState } from "react"
import type { ScheduledSheetView, ScheduledSnacc } from "../../types"
import { useSchedulePicker } from "./use-schedule-picker"
import { useScheduledActions } from "./use-scheduled-actions"
import { useScheduledSnaccs } from "./use-scheduled-snaccs"

export function useScheduledSheet({ enabled }: { enabled: boolean }) {
  const list = useScheduledSnaccs({ enabled })
  const actions = useScheduledActions()
  const picker = useSchedulePicker()
  const [view, setView] = useState<ScheduledSheetView>("list")
  const [actingId, setActingId] = useState<string | null>(null)
  const acting = list.scheduled.find((item) => item.id === actingId) ?? null
  const shown: ScheduledSheetView = acting ? view : "list"
  const toList = () => setView("list")

  return {
    count: list.total ?? 0,
    reset: () => {
      setView("list")
      setActingId(null)
    },
    sheet: {
      view: shown,
      scheduled: list.scheduled,
      loading: list.loading,
      failed: list.failed,
      onRetry: list.retry,
      busy: actions.busy,
      onPick: (item: ScheduledSnacc) => {
        setActingId(item.id)
        setView("detail")
      },
      onDelete: actions.confirmDelete,
      acting,
      posting: acting ? actions.publishing.has(acting.id) : false,
      deleting: acting ? actions.deleting.has(acting.id) : false,
      onBack: () => setView(view === "time" ? "detail" : "list"),
      onPostNow: () => {
        if (acting) actions.publish(acting, toList)
      },
      onChangeTime: () => {
        if (!acting) return
        picker.startFrom(acting.publish_at)
        setView("time")
      },
      onDeleteActing: () => {
        if (acting) actions.confirmDelete(acting, toList)
      },
      picker: {
        ...picker.props,
        confirmLabel: "Save",
        confirming: actions.rescheduling,
        onConfirm: () => {
          if (acting) actions.reschedule(acting.id, picker.value, toList)
        },
      },
    },
  }
}
