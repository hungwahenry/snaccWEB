"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { readMe, refreshMe } from "@/features/auth/cache"
import { handleOf } from "@/features/users/utils/names"
import { showError } from "@/lib/feedback"
import { removeFollower } from "../api"
import { dropFollower } from "../cache"
import type { FollowUser } from "../types"
import { followKeys } from "../utils/keys"

/** Stops someone following you. They aren't told; they just stop seeing what followers see. */
export function useRemoveFollower() {
  const queryClient = useQueryClient()
  const remove = useMutation({
    mutationFn: (user: FollowUser) => removeFollower(user.id),
    onMutate: (user) => {
      const own = readMe()?.profile?.username
      if (own) dropFollower(own, user.id)
    },
    onSuccess: () => void refreshMe(),
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: followKeys.lists() })
      showError(error)
    },
  })

  return (user: FollowUser) =>
    confirm({
      title: `Remove ${handleOf(user) ?? "this follower"}?`,
      message:
        "They won't be told. They'll need to follow you again to see what followers see.",
      actions: [
        {
          label: "Remove",
          destructive: true,
          onPress: () => remove.mutate(user),
        },
      ],
    })
}
