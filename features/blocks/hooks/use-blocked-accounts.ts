"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import type { SnaccAuthor } from "@/features/snaccs/types"
import { getBlockedAccounts, unblockUser } from "../api"

const KEY = ["blocks"]

export function useBlockedAccounts() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: KEY, queryFn: getBlockedAccounts })

  const unblock = useMutation({
    mutationFn: (user: SnaccAuthor) => unblockUser(user.id),
    onSuccess: (_result, user) => {
      queryClient.setQueryData<SnaccAuthor[]>(KEY, (list) =>
        list?.filter((entry) => entry.id !== user.id)
      )
      toast.success(
        `Unblocked ${user.username ? `@${user.username}` : "them"}.`
      )
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return {
    users: query.data ?? [],
    loading: query.isPending,
    failed: query.isError,
    retry: () => void query.refetch(),
    unblock: unblock.mutate,
    unblocking: unblock.isPending ? (unblock.variables?.id ?? null) : null,
  }
}
