"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { handleOf } from "@/features/users/utils/names"
import { showError } from "@/lib/feedback"
import { followUser, unfollowUser } from "../api"
import {
  restoreFollows,
  setFollowState,
  snapshotFollows,
  type FollowTarget,
} from "../cache"
import type { FollowState } from "../types"
import { nextFollowState } from "../utils/follow-state"

interface FollowChange {
  user: FollowTarget
  next: FollowState
}

type Followable = FollowTarget & {
  follow_state: FollowState
  is_private: boolean
}

/** Follow, ask, or take either back; the button moves at once and settles on what the server says. */
export function useFollowToggle() {
  const change = useMutation({
    mutationFn: ({ user, next }: FollowChange): Promise<FollowState> =>
      next === "none"
        ? unfollowUser(user.id).then(() => "none" as const)
        : followUser(user.id),
    onMutate: ({ user, next }) => {
      const snapshot = snapshotFollows(user)
      setFollowState(user, next)
      return { snapshot }
    },
    onSuccess: (state, { user }) => setFollowState(user, state),
    onError: (error, _change, context) => {
      restoreFollows(context?.snapshot ?? [])
      showError(error)
    },
  })

  return (user: Followable) => {
    const next = nextFollowState(user.follow_state, user.is_private)
    if (user.follow_state !== "following" || !user.is_private) {
      change.mutate({ user, next })
      return
    }

    confirm({
      title: `Unfollow ${handleOf(user) ?? "them"}?`,
      message:
        "Their account is private, so you'd have to ask again to see their snaccs.",
      actions: [
        {
          label: "Unfollow",
          destructive: true,
          onPress: () => change.mutate({ user, next }),
        },
      ],
    })
  }
}
