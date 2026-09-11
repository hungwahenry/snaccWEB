"use client"

import { useMutation } from "@tanstack/react-query"
import { showError } from "@/lib/feedback"
import { followUser, unfollowUser } from "../api"
import {
  restoreFollows,
  setFollowing,
  snapshotFollows,
  type FollowTarget,
} from "../cache"

interface FollowChange {
  user: FollowTarget
  following: boolean
}

/** Follows or unfollows anyone, from any screen, and keeps every copy of them in step. */
export function useFollowToggle() {
  const change = useMutation({
    mutationFn: ({ user, following }: FollowChange) =>
      following ? followUser(user.id) : unfollowUser(user.id),
    onMutate: ({ user, following }) => {
      const snapshot = snapshotFollows(user)
      setFollowing(user, following)
      return { snapshot }
    },
    onError: (error, _change, context) => {
      restoreFollows(context?.snapshot ?? [])
      showError(error)
    },
  })

  return (user: FollowTarget & { is_following: boolean }) =>
    change.mutate({ user, following: !user.is_following })
}
