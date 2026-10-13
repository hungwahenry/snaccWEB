"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  deleteLegalDraft,
  getLegalDocument,
  listLegalDocuments,
  publishLegalDraft,
  saveLegalDraft,
  startLegalVersion,
} from "../api"
import type {
  AdminLegalDocument,
  LegalDraftInput,
  NewVersionInput,
} from "../types"
import { adminLegalKeys } from "../utils/keys"

export function useLegalDocuments() {
  return useQuery({
    queryKey: adminLegalKeys.list(),
    queryFn: listLegalDocuments,
  })
}

export function useLegalDocument(id: string) {
  return useQuery({
    queryKey: adminLegalKeys.detail(id),
    queryFn: () => getLegalDocument(id),
  })
}

export function useLegalActions({
  onStarted,
  onDeleted,
}: {
  onStarted?: (doc: AdminLegalDocument) => void
  onDeleted?: () => void
} = {}) {
  const touched = (id: string) => [
    adminLegalKeys.list(),
    adminLegalKeys.detail(id),
  ]

  const { run: start } = useAdminMutation({
    mutationFn: (input: NewVersionInput) => startLegalVersion(input),
    success: "Draft started.",
    invalidates: [adminLegalKeys.list()],
    onSuccess: onStarted,
  })
  const { run: save } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: LegalDraftInput }) =>
      saveLegalDraft(id, input),
    success: "Draft saved.",
    invalidates: (_doc, { id }) => touched(id),
  })
  const { run: publish } = useAdminMutation({
    mutationFn: (id: string) => publishLegalDraft(id),
    success: "Published. People will be asked to agree on their next visit.",
    invalidates: (_doc, id) => touched(id),
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteLegalDraft(id),
    success: "Draft deleted.",
    invalidates: [adminLegalKeys.list()],
    onSuccess: onDeleted,
  })

  return useMemo(
    () => ({
      start,
      save: (id: string, input: LegalDraftInput) => save({ id, input }),
      publish,
      remove,
    }),
    [start, save, publish, remove]
  )
}
