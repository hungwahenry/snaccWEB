"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  getNotificationPreferences,
  updateNotificationPreference,
} from "../api"
import type { NotificationPreference } from "../types"
import { sectionsOf } from "../utils/preferences"
import { showError } from "@/lib/feedback"

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
      showError(error)
    },
    onSuccess: (prefs) => queryClient.setQueryData(PREFERENCES_KEY, prefs),
  })

  function toggle(
    preference: NotificationPreference,
    channel: "push" | "email",
    value: boolean
  ) {
    update.mutate({
      category: preference.category,
      push: channel === "push" ? value : preference.push,
      email: channel === "email" ? value : preference.email,
    })
  }

  const sections = useMemo(() => sectionsOf(query.data ?? []), [query.data])

  return {
    sections,
    loading: query.isLoading,
    failed: query.isError,
    retry: () => void query.refetch(),
    toggle,
  }
}
