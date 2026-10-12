"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCampusChoice } from "@/features/universities/hooks/use-campus-choice"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { authKeys } from "@/features/auth/utils/keys"
import { changeUniversity } from "../api"
import { showSuccess } from "@/lib/feedback"

export function useUniversityForm(profile: Profile) {
  const back = useBack("/edit-profile")
  const queryClient = useQueryClient()
  const choice = useCampusChoice()
  const { selected } = choice

  const change = useMutation({
    mutationFn: changeUniversity,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "users" && query.queryKey[1] === "profile",
      })
      showSuccess("Campus updated.")
      back()
    },
  })

  const valid = selected !== null && selected.id !== profile.university?.id

  return {
    locked: profile.university_locked,
    currentName: profile.university?.name ?? null,
    choice,
    valid,
    submitting: change.isPending,
    onSubmit: () => {
      if (valid && selected && !change.isPending) change.mutate(selected.id)
    },
  }
}
