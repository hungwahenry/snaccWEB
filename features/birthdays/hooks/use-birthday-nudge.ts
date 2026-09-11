"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { updateProfile } from "@/features/account/api"
import { useMe } from "@/features/auth/hooks/use-me"
import { useLocalFlag } from "@/hooks/use-local-flag"
import { authKeys } from "@/features/auth/utils/keys"
import {
  EMPTY_BIRTHDAY,
  isComplete,
  type BirthdayDraft,
} from "../components/birthday-fields"
import { showSuccess } from "@/lib/feedback"

const ASKED_KEY = "snacc_birthday_prompt_asked"

export function useBirthdayNudge({
  blocked = false,
}: { blocked?: boolean } = {}) {
  const me = useMe()
  const queryClient = useQueryClient()
  const [asked, markAsked] = useLocalFlag(ASKED_KEY)
  const [open, setOpen] = useState(false)
  const [birthday, setBirthday] = useState<BirthdayDraft>(EMPTY_BIRTHDAY)

  const profile = me.data?.profile
  const eligible = profile?.completed_at != null && profile.birthday === null
  const due = eligible && !blocked && !asked

  const [armed, setArmed] = useState(due)
  if (due !== armed) {
    setArmed(due)
    if (due) setOpen(true)
  }

  const update = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      showSuccess("Birthday saved.")
      setOpen(false)
    },
  })

  function save() {
    if (!isComplete(birthday) || update.isPending || !profile) return

    update.mutate({
      username: profile.username ?? "",
      displayName: profile.display_name ?? "",
      bio: profile.bio ?? "",
      major: profile.major ?? "",
      graduated: profile.graduated,
      graduationYear: profile.graduation_year ?? undefined,
      gender: profile.gender ?? undefined,
      birthDay: birthday.day,
      birthMonth: birthday.month,
    })
  }

  function dismiss() {
    markAsked()
    setOpen(false)
  }

  return {
    resolved: !due || !open,
    sheet: {
      open,
      onOpenChange: (next: boolean) => (next ? setOpen(true) : dismiss()),
      birthday,
      onChange: setBirthday,
      canSave: isComplete(birthday),
      saving: update.isPending,
      onSave: save,
      onDismiss: dismiss,
    },
  }
}
