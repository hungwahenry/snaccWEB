"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { removePerson } from "@/features/follows/cache"
import { removeAuthorSnaccs } from "@/features/snaccs/cache"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { userKeys } from "@/features/users/utils/keys"
import { handleOf } from "@/features/users/utils/names"
import { showSuccess } from "@/lib/feedback"
import { blockUser } from "../api"
import { blockKeys } from "../utils/keys"

interface Blockable {
  id: string
  username: string | null
}

export function useConfirmBlock() {
  const queryClient = useQueryClient()
  const block = useMutation({
    mutationFn: (user: Blockable) => blockUser(user.id),
    onSuccess: (_result, user) => {
      removeAuthorSnaccs(user.id)
      removePerson(user.id)
      void queryClient.invalidateQueries({ queryKey: snaccKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
      void queryClient.invalidateQueries({ queryKey: blockKeys.all() })
      showSuccess(`Blocked ${handleOf(user) ?? "them"}.`)
    },
  })

  return function confirmBlock(user: Blockable, onBlocked?: () => void) {
    const who = handleOf(user) ?? "this person"

    confirm({
      title: `Block ${who}?`,
      message: "You won't see each other's snaccs, comments, or reactions.",
      actions: [
        {
          label: "Block",
          destructive: true,
          onPress: () => block.mutate(user, { onSuccess: onBlocked }),
        },
      ],
    })
  }
}
