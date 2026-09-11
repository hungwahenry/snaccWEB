"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { plural } from "@/features/admin/shell/utils/format"
import type { SuspensionDraft } from "@/features/admin/suspension-reasons/types"
import { toSuspendInput } from "@/features/admin/suspension-reasons/utils/suspension"
import {
  adjustEarnings,
  blockPayouts,
  deleteUser,
  getUser,
  listUsers,
  makeCampusBound,
  makeGlobal,
  pauseEarnings,
  resumeEarnings,
  revokeSessions,
  setUserUniversity,
  suspendUser,
  unblockPayouts,
  unsuspendUser,
} from "../api"
import type { AdjustEarningsInput, UserActions, UserListQuery } from "../types"
import { adminUserKeys } from "../utils/keys"

export function useUsers(query: UserListQuery) {
  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: () => listUsers(query),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getUser(id),
  })
}

export function useUserActions(id: string, onDeleted: () => void): UserActions {
  const invalidates = [adminUserKeys.detail(id), adminUserKeys.lists()]

  const { run: suspend } = useAdminMutation({
    mutationFn: ({ draft, note }: { draft: SuspensionDraft; note?: string }) =>
      suspendUser(id, toSuspendInput(draft, note)),
    success: "Account suspended.",
    invalidates,
  })
  const { run: unsuspend } = useAdminMutation({
    mutationFn: () => unsuspendUser(id),
    success: "Suspension lifted.",
    invalidates,
  })
  const { run: pause } = useAdminMutation({
    mutationFn: (reason?: string) => pauseEarnings(id, reason),
    success: "Earning paused.",
    invalidates,
  })
  const { run: resume } = useAdminMutation({
    mutationFn: () => resumeEarnings(id),
    success: "Earning resumed.",
    invalidates,
  })
  const { run: block } = useAdminMutation({
    mutationFn: (reason?: string) => blockPayouts(id, reason),
    success: "Withdrawals blocked.",
    invalidates,
  })
  const { run: unblock } = useAdminMutation({
    mutationFn: () => unblockPayouts(id),
    success: "Withdrawals allowed again.",
    invalidates,
  })
  const { run: postEverywhere } = useAdminMutation({
    mutationFn: () => makeGlobal(id),
    success: "Their snaccs now reach every campus.",
    invalidates,
  })
  const { run: bindToCampus } = useAdminMutation({
    mutationFn: () => makeCampusBound(id),
    success: "Their snaccs now stay on their campus.",
    invalidates,
  })
  const { run: moveCampus } = useAdminMutation({
    mutationFn: (universityId: string) => setUserUniversity(id, universityId),
    success: "Campus changed.",
    invalidates,
  })
  const { run: adjust } = useAdminMutation({
    mutationFn: (input: AdjustEarningsInput) => adjustEarnings(id, input),
    success: "Unclaimed earnings adjusted.",
    invalidates,
  })
  const { run: signOut } = useAdminMutation({
    mutationFn: () => revokeSessions(id),
    success: ({ revoked }) => `Signed out of ${plural(revoked, "device")}.`,
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (confirmEmail: string) => deleteUser(id, confirmEmail),
    success: "Account deleted.",
    invalidates: [adminUserKeys.lists()],
    onSuccess: onDeleted,
  })

  return useMemo(
    () => ({
      suspend: (draft: SuspensionDraft, note?: string) =>
        suspend({ draft, note }),
      unsuspend,
      pause,
      resume,
      block,
      unblock,
      postEverywhere,
      bindToCampus,
      moveCampus,
      adjust,
      signOut,
      remove,
    }),
    [
      suspend,
      unsuspend,
      pause,
      resume,
      block,
      unblock,
      postEverywhere,
      bindToCampus,
      moveCampus,
      adjust,
      signOut,
      remove,
    ]
  )
}
