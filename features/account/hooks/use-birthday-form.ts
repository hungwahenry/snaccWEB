"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  EMPTY_BIRTHDAY,
  isComplete,
  type BirthdayDraft,
} from "@/features/birthdays/components/birthday-fields"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { authKeys } from "@/features/auth/utils/keys"
import { updateProfile } from "../api"
import { showSuccess } from "@/lib/feedback"

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

  const locked = profile.birthday !== null
  const [birthday, setBirthday] = useState<BirthdayDraft>(
    profile.birthday ?? EMPTY_BIRTHDAY
  )
  const [celebrate, setCelebrate] = useState(profile.celebrate_birthday)

  const valid = locked
    ? celebrate !== profile.celebrate_birthday
    : isComplete(birthday) || celebrate !== profile.celebrate_birthday

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
      ...(!locked && isComplete(birthday)
        ? { birthDay: birthday.day, birthMonth: birthday.month }
        : {}),
      celebrateBirthday: celebrate,
    })
  }

  return {
    locked,
    birthday,
    setBirthday,
    celebrate,
    setCelebrate,
    valid,
    submitting: update.isPending,
    onSubmit,
  }
}
