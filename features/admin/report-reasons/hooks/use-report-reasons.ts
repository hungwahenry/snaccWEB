"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createReason,
  listReasons,
  retireReason,
  unretireReason,
  updateReason,
} from "../api"
import type { ReasonDraft } from "../types"
import { adminReportReasonKeys } from "../utils/keys"
import { toCreateInput, toUpdateInput } from "../utils/report-reasons"

export function useReportReasons() {
  return useQuery({
    queryKey: adminReportReasonKeys.all(),
    queryFn: listReasons,
  })
}

export function useReportReasonActions() {
  const invalidates = [adminReportReasonKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: ReasonDraft; id?: string }) =>
      id
        ? updateReason(id, toUpdateInput(draft))
        : createReason(toCreateInput(draft)),
    success: (_reason, { id }) => (id ? "Reason updated." : "Reason created."),
    invalidates,
  })
  const { run: retire } = useAdminMutation({
    mutationFn: (id: string) => retireReason(id),
    success: "Reason retired.",
    invalidates,
  })
  const { run: restore } = useAdminMutation({
    mutationFn: (id: string) => unretireReason(id),
    success: "Reason restored.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: ReasonDraft, id?: string) => save({ draft, id }),
      retire,
      restore,
    }),
    [save, retire, restore]
  )
}
