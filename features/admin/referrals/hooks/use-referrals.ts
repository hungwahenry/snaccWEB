"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { approveReferral, listReferrals, voidReferral } from "../api"
import type { ReferralListQuery } from "../types"
import { adminReferralKeys } from "../utils/keys"

export function useReferrals(query: ReferralListQuery) {
  return useQuery({
    queryKey: adminReferralKeys.list(query),
    queryFn: () => listReferrals(query),
    placeholderData: keepPreviousData,
  })
}

export function useReferralActions() {
  const invalidates = [adminReferralKeys.all()]

  const { run: approve } = useAdminMutation({
    mutationFn: (id: string) => approveReferral(id),
    success: "Approved. It pays with the next sweep.",
    invalidates,
  })
  const { run: close } = useAdminMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      voidReferral(id, reason),
    success: "Referral closed.",
    invalidates,
  })

  return useMemo(() => ({ approve, close }), [approve, close])
}
