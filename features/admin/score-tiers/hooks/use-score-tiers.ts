"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { createTier, deleteTier, listTiers, updateTier } from "../api"
import type { TierDraft } from "../types"
import { adminTierKeys } from "../utils/keys"
import { sortTiers, toInput } from "../utils/tier"

export function useTiers() {
  return useQuery({
    queryKey: adminTierKeys.list(),
    queryFn: listTiers,
    select: sortTiers,
  })
}

export function useTierActions() {
  const invalidates = [adminTierKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: TierDraft; id?: string }) =>
      id ? updateTier(id, toInput(draft)) : createTier(toInput(draft)),
    success: (_tier, { id }) => (id ? "Tier saved." : "Tier added."),
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteTier(id),
    success: "Tier deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: TierDraft, id?: string) => save({ draft, id }),
      remove,
    }),
    [save, remove]
  )
}
