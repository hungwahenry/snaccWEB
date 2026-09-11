"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { holdUsername, listReservedUsernames, releaseUsername } from "../api"
import type { HoldUsernameInput } from "../types"
import { adminReservedUsernameKeys } from "../utils/keys"
import { toHoldInput } from "../utils/reserved-usernames"

export function useReservedUsernames() {
  return useQuery({
    queryKey: adminReservedUsernameKeys.list(),
    queryFn: listReservedUsernames,
  })
}

export function useReservedUsernameActions() {
  const invalidates = [adminReservedUsernameKeys.all()]

  const { run: hold } = useAdminMutation({
    mutationFn: (draft: HoldUsernameInput) => holdUsername(toHoldInput(draft)),
    success: "Name held.",
    invalidates,
  })
  const { run: release } = useAdminMutation({
    mutationFn: (name: string) => releaseUsername(name),
    success: "Name released.",
    invalidates,
  })

  return useMemo(() => ({ hold, release }), [hold, release])
}
