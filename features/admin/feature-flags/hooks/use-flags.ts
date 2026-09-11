"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listFlags, updateFlag } from "../api"
import type { FlagDraft } from "../types"
import { described, groupByCategory, toFlagChanges } from "../utils/flags"
import { adminFlagKeys } from "../utils/keys"

export function useFlagGroups() {
  return useQuery({
    queryKey: adminFlagKeys.list(),
    queryFn: listFlags,
    select: groupByCategory,
  })
}

export function useFlagActions() {
  const invalidates = [adminFlagKeys.all()]

  const { run: toggle } = useAdminMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      updateFlag(key, { enabled }),
    success: described,
    invalidates,
  })
  const { run: save } = useAdminMutation({
    mutationFn: ({ key, draft }: { key: string; draft: FlagDraft }) =>
      updateFlag(key, toFlagChanges(draft)),
    success: described,
    invalidates,
  })

  return useMemo(
    () => ({
      setEnabled: (key: string, enabled: boolean) => toggle({ key, enabled }),
      saveAvailability: (key: string, draft: FlagDraft) => save({ key, draft }),
    }),
    [toggle, save]
  )
}
