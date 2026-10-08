"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { handleOf } from "@/features/users/utils/names"
import { showSuccess } from "@/lib/feedback"
import { blockUser } from "../api"
import { hideEachOther, refreshSeparated } from "../cache"
import { blockKeys } from "../utils/keys"

interface Blockable {
  id: string
  username: string | null
}

export function useConfirmBlock() {
  const queryClient = useQueryClient()
  const block = useMutation({
    mutationFn: (user: Blockable) => blockUser(user.id),
    onMutate: (user) => hideEachOther(user.id),
    onSuccess: (_result, user) =>
      showSuccess(`Blocked ${handleOf(user) ?? "them"}.`),
    onSettled: () => {
      refreshSeparated()
      void queryClient.invalidateQueries({ queryKey: blockKeys.all() })
    },
  })

  return function confirmBlock(user: Blockable, onBlocked?: () => void) {
    const who = handleOf(user) ?? "this person"

    confirm({
      title: `Block ${who}?`,
      message: "You won't see each other's snaccs, comments, or likes.",
      actions: [
        {
          label: "Block",
          destructive: true,
          onPress: () => {
            block.mutate(user)
            onBlocked?.()
          },
        },
      ],
    })
  }
}
