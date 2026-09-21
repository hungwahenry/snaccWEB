"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { snaccPath } from "@/features/snaccs/routes"
import { useBack } from "@/hooks/use-back"
import { showSuccess } from "@/lib/feedback"
import { cancelHangout, editHangout } from "../../api"
import { hangoutListsChanged, patchHangout } from "../../cache"
import type { HangoutDraft, HangoutPayload, SnaccHangout } from "../../types"
import {
  fromHangout,
  hangoutChanged,
  hangoutPayload,
} from "../../utils/hangout-draft"
import { hangoutTitle, stateAt } from "../../utils/hangouts"
import { othersIn } from "../../utils/host"
import { useHangoutEditor } from "./use-hangout-editor"
import { useHangoutLimits } from "./use-hangout-limits"

export function useEditHangoutScreen(snaccId: string, hangout: SnaccHangout) {
  const back = useBack(snaccPath(snaccId))
  const base = useHangoutLimits()
  const limits = {
    ...base,
    capacityMin: Math.max(base.capacityMin, hangout.going_count),
  }
  const [original] = useState(() => fromHangout(hangout))
  const [draft, setDraft] = useState<HangoutDraft>(original)

  function change(patch: Partial<HangoutDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  const { now, valid, fields, timeSheet } = useHangoutEditor(
    draft,
    limits,
    change,
    original.startsAt
  )
  const upcoming = stateAt(hangout, now) === "upcoming"

  const save = useMutation({
    mutationFn: (edit: HangoutPayload) => editHangout(snaccId, edit),
    onSuccess: (updated) => {
      patchHangout(snaccId, () => updated)
      showSuccess("Hangout updated.")
      back()
    },
  })

  const cancel = useMutation({
    mutationFn: () => cancelHangout(snaccId),
    onSuccess: (updated) => {
      patchHangout(snaccId, () => updated)
      hangoutListsChanged()
      showSuccess("Hangout called off.")
      back()
    },
  })

  const changed = hangoutChanged(draft, original)

  return {
    onBack: back,
    editor: {
      hangout: draft,
      ...fields,
      onEditTime: upcoming ? fields.onEditTime : undefined,
      accessLocked: othersIn(hangout) > 0,
    },
    timeSheet,
    canSave: valid && changed && !save.isPending && !cancel.isPending,
    saving: save.isPending,
    save: () => {
      const edit = hangoutPayload(draft)
      if (edit && valid && changed && !save.isPending) save.mutate(edit)
    },
    cancelling: cancel.isPending,
    onCancel: () =>
      confirm({
        title: `Call off ${hangoutTitle(hangout)}?`,
        message:
          "Everyone going is told and the chat closes. The snacc stays, marked called off.",
        actions: [
          {
            label: "Call it off",
            destructive: true,
            onPress: () => cancel.mutate(),
          },
        ],
      }),
  }
}
