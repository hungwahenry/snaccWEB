"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createSuspensionReason,
  listSuspensionReasons,
  updateSuspensionReason,
} from "../api"
import type { SuspensionReasonDraft } from "../types"
import { adminSuspensionReasonKeys } from "../utils/keys"
import { durationOptions, pickableReasons } from "../utils/suspension"
import {
  sortReasons,
  toCreateInput,
  toUpdateInput,
} from "../utils/suspension-reasons"

export function useSuspensionReasons() {
  return useQuery({
    queryKey: adminSuspensionReasonKeys.all(),
    queryFn: listSuspensionReasons,
    select: sortReasons,
  })
}

/** What a moderator can choose from when suspending someone. */
export function useSuspensionChoices() {
  const reasons = useSuspensionReasons().data
  const days = useConfigValue("moderation.suspension.durations_days")

  return useMemo(
    () => ({
      reasons: pickableReasons(reasons ?? []),
      durations: durationOptions(days),
    }),
    [reasons, days]
  )
}

export function useSuspensionReasonActions() {
  const invalidates = [adminSuspensionReasonKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({
      draft,
      id,
    }: {
      draft: SuspensionReasonDraft
      id?: string
    }) =>
      id
        ? updateSuspensionReason(id, toUpdateInput(draft))
        : createSuspensionReason(toCreateInput(draft)),
    success: (_reason, { id }) => (id ? "Reason saved." : "Reason added."),
    invalidates,
  })
  const { run: setRetired } = useAdminMutation({
    mutationFn: ({ id, retired }: { id: string; retired: boolean }) =>
      updateSuspensionReason(id, { retired }),
    success: (_reason, { retired }) =>
      retired ? "Reason retired." : "Reason restored.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: SuspensionReasonDraft, id?: string) => save({ draft, id }),
      setRetired: (id: string, retired: boolean) => setRetired({ id, retired }),
    }),
    [save, setRetired]
  )
}
