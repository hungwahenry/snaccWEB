"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { authKeys } from "@/features/auth/utils/keys"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { showSuccess } from "@/lib/feedback"
import { updateProfile } from "../api"

export function useBirthdayForm(profile: Profile) {
  const back = useBack("/edit-profile")
  const queryClient = useQueryClient()
  const update = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      showSuccess("Birthday saved.")
      back()
    },
  })

  const [celebrate, setCelebrate] = useState(profile.celebrate_birthday)
  const valid = celebrate !== profile.celebrate_birthday

  function onSubmit() {
    if (!valid || update.isPending) return

    update.mutate({
      username: profile.username ?? "",
      displayName: profile.display_name ?? "",
      bio: profile.bio ?? "",
      major: profile.major ?? "",
      graduated: profile.graduated,
      graduationYear: profile.graduation_year ?? undefined,
      gender: profile.gender ?? undefined,
      celebrateBirthday: celebrate,
    })
  }

  return {
    birthday: profile.birthday,
    celebrate,
    setCelebrate,
    valid,
    submitting: update.isPending,
    onSubmit,
  }
}
