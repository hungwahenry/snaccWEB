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
  mergeUniversity,
  rejectUniversity,
  updateUniversity,
  verifyUniversity,
} from "../api"
import type { UniversityDraft, UniversityListQuery } from "../types"
import { adminUniversityKeys } from "../utils/keys"
import { verifiedCampuses } from "../utils/status"
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

export function useCampuses() {
  const query = useQuery({
    queryKey: adminUniversityKeys.everything(),
    queryFn: listAllUniversities,
    staleTime: 5 * MINUTE_MS,
  })
  const universities = query.data

  return useMemo(() => {
    const all = universities ?? []
    const verified = verifiedCampuses(all)

    return {
      all,
      verified,
      options: campusOptions(verified),
      acronyms: acronymsById(all),
      loading: query.isPending,
    }
  }, [universities, query.isPending])
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
  const { run: verify } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: UniversityDraft; id: string }) =>
      verifyUniversity(id, toUpdateInput(draft)),
    success: "Campus verified.",
    invalidates,
  })
  const { run: reject } = useAdminMutation({
    mutationFn: (id: string) => rejectUniversity(id),
    success: "Campus turned down. Its people will choose again.",
    invalidates,
  })
  const { run: merge } = useAdminMutation({
    mutationFn: ({ id, intoId }: { id: string; intoId: string }) =>
      mergeUniversity(id, intoId),
    success: "Campuses merged.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: UniversityDraft, id?: string) => save({ draft, id }),
      remove,
      verify: (draft: UniversityDraft, id: string) => verify({ draft, id }),
      reject,
      merge: (id: string, intoId: string) => merge({ id, intoId }),
    }),
    [save, remove, verify, reject, merge]
  )
}
