"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { createAdReason, listAdReasons, updateAdReason } from "../api"
import type { AdReasonDraft } from "../types"
import {
  pickableReasons,
  sortReasons,
  toCreateInput,
  toUpdateInput,
} from "../utils/ad-reasons"
import { adminAdKeys } from "../utils/keys"

export function useAdReasons() {
  return useQuery({
    queryKey: adminAdKeys.reasons(),
    queryFn: listAdReasons,
    select: sortReasons,
  })
}

export function useRejectionChoices() {
  const reasons = useAdReasons().data

  return useMemo(() => pickableReasons(reasons ?? []), [reasons])
}

export function useAdReasonActions() {
  const invalidates = [adminAdKeys.reasons()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: AdReasonDraft; id?: string }) =>
      id
        ? updateAdReason(id, toUpdateInput(draft))
        : createAdReason(toCreateInput(draft)),
    success: (_reason, { id }) => (id ? "Reason saved." : "Reason added."),
    invalidates,
  })
  const { run: setRetired } = useAdminMutation({
    mutationFn: ({ id, retired }: { id: string; retired: boolean }) =>
      updateAdReason(id, { retired }),
    success: (_reason, { retired }) =>
      retired ? "Reason retired." : "Reason restored.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: AdReasonDraft, id?: string) => save({ draft, id }),
      setRetired: (id: string, retired: boolean) => setRetired({ id, retired }),
    }),
    [save, setRetired]
  )
}
