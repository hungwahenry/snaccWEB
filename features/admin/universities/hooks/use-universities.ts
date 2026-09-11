"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { MINUTE_MS } from "@/lib/duration"
import {
  createUniversity,
  deleteUniversity,
  listAllUniversities,
  listUniversities,
  updateUniversity,
} from "../api"
import type { UniversityDraft, UniversityListQuery } from "../types"
import { adminUniversityKeys } from "../utils/keys"
import {
  acronymsById,
  campusOptions,
  toCreateInput,
  toUpdateInput,
} from "../utils/university"

export function useUniversities(query: UniversityListQuery) {
  return useQuery({
    queryKey: adminUniversityKeys.list(query),
    queryFn: () => listUniversities(query),
    placeholderData: keepPreviousData,
  })
}

/** Every campus, for pickers and for naming campuses by acronym. */
export function useCampuses() {
  const query = useQuery({
    queryKey: adminUniversityKeys.everything(),
    queryFn: listAllUniversities,
    staleTime: 5 * MINUTE_MS,
  })
  const universities = query.data

  return useMemo(
    () => ({
      universities: universities ?? [],
      options: campusOptions(universities ?? []),
      acronyms: acronymsById(universities ?? []),
      loading: query.isPending,
    }),
    [universities, query.isPending]
  )
}

export function useUniversityActions() {
  const invalidates = [adminUniversityKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: UniversityDraft; id?: string }) =>
      id
        ? updateUniversity(id, toUpdateInput(draft))
        : createUniversity(toCreateInput(draft)),
    success: (_university, { id }) =>
      id ? "University saved." : "University added.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteUniversity(id),
    success: "University deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: UniversityDraft, id?: string) => save({ draft, id }),
      remove,
    }),
    [save, remove]
  )
}
