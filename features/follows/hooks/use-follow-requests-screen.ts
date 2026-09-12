"use client"

import { useMutation } from "@tanstack/react-query"
import { patchMe, refreshMe } from "@/features/auth/cache"
import { NOTIFICATIONS_PATH } from "@/features/notifications/routes"
import { useBack } from "@/hooks/use-back"
import { showError } from "@/lib/feedback"
import { acceptFollowRequest, declineFollowRequest } from "../api"
import { removeRequest, requestsChanged } from "../cache"
import type { FollowUser } from "../types"
import { useFollowRequests } from "./use-follow-requests"

interface Answer {
  user: FollowUser
  accept: boolean
}

/** Say yes and they follow you; say no and they are simply not told. */
export function useFollowRequestsScreen() {
  const back = useBack(NOTIFICATIONS_PATH)
  const list = useFollowRequests()

  const answer = useMutation({
    mutationFn: ({ user, accept }: Answer) =>
      accept ? acceptFollowRequest(user.id) : declineFollowRequest(user.id),
    onMutate: ({ user, accept }) => {
      removeRequest(user.id)
      if (accept) {
        patchMe((profile) => ({
          ...profile,
          followers_count: profile.followers_count + 1,
        }))
      }
    },
    onError: (error, { accept }) => {
      requestsChanged()
      if (accept) void refreshMe()
      showError(error)
    },
  })

  return {
    onBack: back,
    list,
    onAccept: (user: FollowUser) => answer.mutate({ user, accept: true }),
    onDecline: (user: FollowUser) => answer.mutate({ user, accept: false }),
  }
}
