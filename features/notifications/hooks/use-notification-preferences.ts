"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  getNotificationPreferences,
  updateNotificationPreference,
} from "../api"
import type { NotificationPreference } from "../types"

const PREFERENCES_KEY = ["notifications", "preferences"]

export function useNotificationPreferences() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: PREFERENCES_KEY,
    queryFn: getNotificationPreferences,
  })

  const update = useMutation({
    mutationFn: updateNotificationPreference,
    onMutate: (input) => {
      const previous =
        queryClient.getQueryData<NotificationPreference[]>(PREFERENCES_KEY)
      queryClient.setQueryData<NotificationPreference[]>(
        PREFERENCES_KEY,
        (prefs) =>
          prefs?.map((pref) =>
            pref.category === input.category
              ? { ...pref, push: input.push, email: input.email }
              : pref
          )
      )
      return { previous }
    },
    onError: (error, _input, context) => {
      if (context?.previous)
        queryClient.setQueryData(PREFERENCES_KEY, context.previous)
      toast.error(getErrorMessage(error))
    },
    onSuccess: (prefs) => queryClient.setQueryData(PREFERENCES_KEY, prefs),
  })

  function toggle(
    preference: NotificationPreference,
    channel: "push" | "email",
    value: boolean
  ) {
    if (preference.locked) return

    update.mutate({
      category: preference.category,
      push: channel === "push" ? value : preference.push,
      email: channel === "email" ? value : preference.email,
    })
  }

  return {
    preferences: query.data ?? [],
    loading: query.isLoading,
    failed: query.isError,
    retry: () => void query.refetch(),
    toggle,
  }
}
