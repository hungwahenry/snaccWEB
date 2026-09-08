"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { profileKey } from "@/features/users/hooks/use-profile"
import type { PublicProfile } from "@/features/users/types"
import { getErrorMessage } from "@/lib/api/errors"
import { setPostNotifications } from "../api"

export function usePostNotifications(username: string) {
  const queryClient = useQueryClient()
  const key = profileKey(username)

  return useMutation({
    mutationFn: (profile: PublicProfile) =>
      setPostNotifications(profile.id, !profile.notifying),
    onMutate: (profile) => {
      const previous = queryClient.getQueryData<PublicProfile>(key)
      queryClient.setQueryData<PublicProfile>(key, (current) =>
        current ? { ...current, notifying: !profile.notifying } : current
      )
      return { previous }
    },
    onSuccess: (_result, profile) => {
      toast.success(
        profile.notifying ? "Notifications off" : "You'll hear when they post"
      )
    },
    onError: (error, _profile, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      toast.error(getErrorMessage(error))
    },
  })
}
