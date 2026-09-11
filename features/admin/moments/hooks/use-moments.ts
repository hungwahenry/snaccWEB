"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listMoments, releaseMoment, removeMoment } from "../api"
import type { MomentListQuery } from "../types"
import { adminMomentKeys } from "../utils/keys"

export function useMoments(query: MomentListQuery) {
  return useQuery({
    queryKey: adminMomentKeys.list(query),
    queryFn: () => listMoments(query),
    placeholderData: keepPreviousData,
  })
}

export function useMomentActions() {
  const invalidates = [adminMomentKeys.all()]

  const { run: release } = useAdminMutation({
    mutationFn: (id: string) => releaseMoment(id),
    success: "Moment released.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => removeMoment(id),
    success: "Moment removed.",
    invalidates,
  })

  return useMemo(() => ({ release, remove }), [release, remove])
}
