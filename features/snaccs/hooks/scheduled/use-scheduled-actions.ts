"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { usePendingVariables } from "@/hooks/use-pending-variables"
import { showHeld, showSuccess } from "@/lib/feedback"
import { deleteScheduled, publishScheduled, rescheduleSnacc } from "../../api"
import { insertSnacc } from "../../cache"
import {
  dropScheduled,
  replaceScheduled,
  scheduledChanged,
} from "../../cache/scheduled"
import type { ScheduledSnacc } from "../../types"
import { scheduledMutationKeys } from "../../utils/keys"
import { goesOutLabel } from "../../utils/schedule"

export function useScheduledActions() {
  const publishing = usePendingVariables<string>(
    scheduledMutationKeys.publish()
  )
  const deleting = usePendingVariables<string>(scheduledMutationKeys.remove())

  const publish = useMutation({
    mutationKey: scheduledMutationKeys.publish(),
    mutationFn: publishScheduled,
    onSuccess: (snacc, id) => {
      dropScheduled(id)
      if (snacc.held) {
        showHeld()
        return
      }
      insertSnacc(snacc)
      showSuccess("Posted.")
    },
    onSettled: scheduledChanged,
  })

  const reschedule = useMutation({
    mutationFn: rescheduleSnacc,
    onSuccess: (item) => {
      replaceScheduled(item)
      showSuccess(`Scheduled for ${goesOutLabel(item.publish_at)}`)
    },
    onSettled: scheduledChanged,
  })

  const remove = useMutation({
    mutationKey: scheduledMutationKeys.remove(),
    mutationFn: deleteScheduled,
    onSuccess: (_data, id) => {
      dropScheduled(id)
      showSuccess("Scheduled snacc deleted.")
    },
    onSettled: scheduledChanged,
  })

  return {
    busy: new Set([...publishing, ...deleting]),
    publishing: new Set(publishing),
    deleting: new Set(deleting),
    rescheduling: reschedule.isPending,
    publish: (item: ScheduledSnacc, onDone?: () => void) =>
      publish.mutate(item.id, { onSuccess: onDone }),
    reschedule: (id: string, at: Date, onDone: () => void) =>
      reschedule.mutate(
        { id, publishAt: at.toISOString() },
        { onSuccess: onDone }
      ),
    confirmDelete: (item: ScheduledSnacc, onDone?: () => void) =>
      confirm({
        title: "Delete this scheduled snacc?",
        message: "It won't go out.",
        actions: [
          {
            label: "Delete",
            destructive: true,
            onPress: () => remove.mutate(item.id, { onSuccess: onDone }),
          },
        ],
      }),
  }
}
