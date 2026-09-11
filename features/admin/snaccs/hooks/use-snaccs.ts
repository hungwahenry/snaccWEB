"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  deleteSnacc,
  getSnacc,
  holdSnacc,
  listSnaccs,
  pinSnacc,
  releaseSnacc,
  unpinSnacc,
} from "../api"
import type { SnaccActions, SnaccListQuery } from "../types"
import { adminSnaccKeys } from "../utils/keys"

export function useSnaccs(query: SnaccListQuery) {
  return useQuery({
    queryKey: adminSnaccKeys.list(query),
    queryFn: () => listSnaccs(query),
    placeholderData: keepPreviousData,
  })
}

export function useSnacc(id: string) {
  return useQuery({
    queryKey: adminSnaccKeys.detail(id),
    queryFn: () => getSnacc(id),
  })
}

export function useSnaccActions(): SnaccActions {
  const invalidates = [adminSnaccKeys.all()]

  const { run: remove } = useAdminMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      deleteSnacc(id, reason),
    success: "Snacc removed for good.",
    invalidates,
  })
  const { run: hold } = useAdminMutation({
    mutationFn: (id: string) => holdSnacc(id),
    success: "Snacc held.",
    invalidates,
  })
  const { run: release } = useAdminMutation({
    mutationFn: (id: string) => releaseSnacc(id),
    success: "Snacc released.",
    invalidates,
  })
  const { run: pin } = useAdminMutation({
    mutationFn: (id: string) => pinSnacc(id),
    success: "Snacc pinned.",
    invalidates,
  })
  const { run: unpin } = useAdminMutation({
    mutationFn: (id: string) => unpinSnacc(id),
    success: "Snacc unpinned.",
    invalidates,
  })

  return useMemo(
    () => ({
      remove: (id: string, reason?: string) => remove({ id, reason }),
      hold,
      release,
      pin,
      unpin,
    }),
    [remove, hold, release, pin, unpin]
  )
}
