"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SnaccAuthor } from "@/features/snaccs/types"
import { handleOf } from "@/features/users/utils/names"
import { showSuccess } from "@/lib/feedback"
import { getBlockedAccounts, unblockUser } from "../api"
import { blockKeys } from "../utils/keys"

const KEY = blockKeys.all()

export function useBlockedAccounts() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: KEY, queryFn: getBlockedAccounts })

  const unblock = useMutation({
    mutationFn: (user: SnaccAuthor) => unblockUser(user.id),
    onSuccess: (_result, user) => {
      queryClient.setQueryData<SnaccAuthor[]>(KEY, (list) =>
        list?.filter((entry) => entry.id !== user.id)
      )
      showSuccess(`Unblocked ${handleOf(user) ?? "them"}.`)
    },
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
