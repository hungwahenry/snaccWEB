"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { removeAuthorSnaccs } from "@/features/snaccs/cache"
import { getErrorMessage } from "@/lib/api/errors"
import { FEED_KEY } from "@/lib/query-keys"
import { blockUser } from "../api"

type Blockable = { id: string; username: string | null }

export function useConfirmBlock() {
  const queryClient = useQueryClient()
  const block = useMutation({ mutationFn: blockUser })

  return function confirmBlock(user: Blockable, onBlocked?: () => void) {
    const who = user.username ? `@${user.username}` : "this person"

    confirm({
      title: `Block ${who}?`,
      message: "You won't see each other's snaccs, comments, or reactions.",
      actions: [
        {
          label: "Block",
          destructive: true,
          onPress: () =>
            block.mutate(user.id, {
              onSuccess: () => {
                removeAuthorSnaccs(user.id)
                void queryClient.invalidateQueries({ queryKey: FEED_KEY })
                toast.success(`Blocked ${who}.`)
                onBlocked?.()
              },
              onError: (error) => toast.error(getErrorMessage(error)),
            }),
        },
      ],
    })
  }
}
