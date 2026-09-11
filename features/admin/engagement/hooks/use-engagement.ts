"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listEngagement, resetEngagement, updateEngagement } from "../api"
import type { AdminEngagementKind, EngagementDraft } from "../types"
import { groupBySource, toUpdateInput } from "../utils/engagement"
import { adminEngagementKeys } from "../utils/keys"

/** Every act in the catalog, in the order the API keeps them. Earnings filters by these. */
export function useEngagementKinds(): UseQueryResult<AdminEngagementKind[]> {
  return useQuery({
    queryKey: adminEngagementKeys.list(),
    queryFn: listEngagement,
  })
}

export function useEngagementGroups() {
  return useQuery({
    queryKey: adminEngagementKeys.list(),
    queryFn: listEngagement,
    select: groupBySource,
  })
}

export function useEngagementActions() {
  const invalidates = [adminEngagementKeys.all()]

  const { run: reprice } = useAdminMutation({
    mutationFn: ({ key, draft }: { key: string; draft: EngagementDraft }) =>
      updateEngagement(key, toUpdateInput(draft)),
    success: (kind) => `${kind.label} repriced.`,
    invalidates,
  })
  const { run: toggle } = useAdminMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      updateEngagement(key, { enabled }),
    success: (kind) =>
      kind.enabled ? `${kind.label} turned on.` : `${kind.label} turned off.`,
    invalidates,
  })
  const { run: reset } = useAdminMutation({
    mutationFn: (key: string) => resetEngagement(key),
    success: (kind) => `${kind.label} is back on the shipped weights.`,
    invalidates,
  })

  return useMemo(
    () => ({
      reprice: (key: string, draft: EngagementDraft) => reprice({ key, draft }),
      setEnabled: (key: string, enabled: boolean) => toggle({ key, enabled }),
      reset,
    }),
    [reprice, toggle, reset]
  )
}
