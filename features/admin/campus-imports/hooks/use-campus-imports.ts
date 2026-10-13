"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { adminUniversityKeys } from "@/features/admin/universities/utils/keys"
import {
  applyCampusImport,
  checkCountryCampuses,
  discardCampusImport,
  editCampusImportRow,
  getCampusImport,
  importCampuses,
  listCampusImportRows,
  listCampusImports,
  recheckCampusImport,
} from "../api"
import type {
  CampusImportListQuery,
  CampusImportRowEdit,
  CampusImportRowQuery,
} from "../types"
import { importPoll } from "../utils/campus-imports"
import { adminCampusImportKeys } from "../utils/keys"

export function useCampusImports(query: CampusImportListQuery) {
  return useQuery({
    queryKey: adminCampusImportKeys.list(query),
    queryFn: () => listCampusImports(query),
    placeholderData: keepPreviousData,
    refetchInterval: (current) =>
      importPoll(current.state.data?.items.map((run) => run.status) ?? []),
  })
}

export function useCampusImport(id: string) {
  return useQuery({
    queryKey: adminCampusImportKeys.detail(id),
    queryFn: () => getCampusImport(id),
    refetchInterval: (current) =>
      importPoll(current.state.data ? [current.state.data.status] : []),
  })
}

export function useCampusImportRows(
  id: string,
  checkedAt: string | null,
  query: CampusImportRowQuery,
  enabled: boolean
) {
  return useQuery({
    queryKey: adminCampusImportKeys.rows(id, checkedAt, query),
    queryFn: () => listCampusImportRows(id, query),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useCampusImportActions() {
  const invalidates = [adminCampusImportKeys.all()]

  const { run: create } = useAdminMutation({
    mutationFn: importCampuses,
    success: "Uploaded. Checking the campuses now.",
    invalidates,
  })
  const { run: checkCountry } = useAdminMutation({
    mutationFn: checkCountryCampuses,
    success: "Checking the campuses now.",
    invalidates,
  })
  const { run: editRow } = useAdminMutation({
    mutationFn: ({
      id,
      rowId,
      edit,
    }: {
      id: string
      rowId: string
      edit: CampusImportRowEdit
    }) => editCampusImportRow(id, rowId, edit),
    success: "Saved.",
    invalidates: (_row, { id }) => [adminCampusImportKeys.detail(id)],
  })
  const { run: recheck } = useAdminMutation({
    mutationFn: recheckCampusImport,
    success: "Checking again.",
    invalidates,
  })
  const { run: apply } = useAdminMutation({
    mutationFn: applyCampusImport,
    success: (applied) =>
      `Applied: ${applied.created} added, ${applied.updated} updated, ${applied.merged} merged.`,
    invalidates: [adminCampusImportKeys.all(), adminUniversityKeys.all()],
  })
  const { run: discard } = useAdminMutation({
    mutationFn: discardCampusImport,
    success: "Import discarded.",
    invalidates,
  })

  return useMemo(
    () => ({
      create,
      checkCountry,
      editRow: (id: string, rowId: string, edit: CampusImportRowEdit) =>
        editRow({ id, rowId, edit }),
      recheck,
      apply,
      discard,
    }),
    [create, checkCountry, editRow, recheck, apply, discard]
  )
}
