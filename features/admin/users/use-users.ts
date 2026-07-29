"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  adjustBalance,
  blockPayouts,
  deleteUser,
  getUser,
  listUsers,
  pauseEarnings,
  resumeEarnings,
  revokeSessions,
  setRole,
  suspendUser,
  unblockPayouts,
  unsuspendUser,
} from "./api"
import type { ListUsersParams } from "./types"

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: string) {
  return useQuery({ queryKey: ["admin", "user", id], queryFn: () => getUser(id), enabled: !!id })
}

export function useUserMutations(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    queryClient.invalidateQueries({ queryKey: ["admin", "user", id] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    suspend: useMutation({
      mutationFn: (reason?: string) => suspendUser(id, reason),
      onSuccess: () => {
        invalidate()
        toast.success("User suspended.")
      },
      onError,
    }),
    unsuspend: useMutation({
      mutationFn: () => unsuspendUser(id),
      onSuccess: () => {
        invalidate()
        toast.success("User reinstated.")
      },
      onError,
    }),
    pauseEarnings: useMutation({
      mutationFn: (reason?: string) => pauseEarnings(id, reason),
      onSuccess: () => {
        invalidate()
        toast.success("Earnings paused.")
      },
      onError,
    }),
    resumeEarnings: useMutation({
      mutationFn: () => resumeEarnings(id),
      onSuccess: () => {
        invalidate()
        toast.success("Earnings resumed.")
      },
      onError,
    }),
    blockPayouts: useMutation({
      mutationFn: (reason?: string) => blockPayouts(id, reason),
      onSuccess: () => {
        invalidate()
        toast.success("Payouts blocked.")
      },
      onError,
    }),
    unblockPayouts: useMutation({
      mutationFn: () => unblockPayouts(id),
      onSuccess: () => {
        invalidate()
        toast.success("Payouts unblocked.")
      },
      onError,
    }),
    changeRole: useMutation({
      mutationFn: (role: string) => setRole(id, role),
      onSuccess: () => {
        invalidate()
        toast.success("Role updated.")
      },
      onError,
    }),
    balance: useMutation({
      mutationFn: (input: { delta: number; reason?: string }) =>
        adjustBalance(id, input.delta, input.reason),
      onSuccess: () => {
        invalidate()
        toast.success("Balance adjusted.")
      },
      onError,
    }),
    revoke: useMutation({
      mutationFn: () => revokeSessions(id),
      onSuccess: (result) => {
        invalidate()
        toast.success(`Revoked ${result.revoked} session(s).`)
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: (confirmEmail: string) => deleteUser(id, confirmEmail),
      onSuccess: () => {
        toast.success("User deleted.")
        router.replace("/admin/users")
      },
      onError,
    }),
  }
}
