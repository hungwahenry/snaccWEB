"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { resetMe } from "@/features/auth/cache"
import { HOME_PATH } from "@/features/feed/routes"
import { getErrorMessage, isSuspended } from "@/lib/api/errors"
import { SUSPENDED_PATH } from "@/features/suspensions/routes"
import { getKnownBirthDate, setBirthDate } from "../api"
import type { BirthDateDraft } from "../types"
import { confirm } from "@/components/ui/confirm"
import {
  birthDateCheck,
  EMPTY_BIRTH_DATE,
  isWholeDate,
} from "../utils/birth-date"

export function useBirthDateScreen() {
  const router = useRouter()
  const logout = useLogout()
  const known = useQuery({
    queryKey: ["profile", "birth-date"],
    queryFn: getKnownBirthDate,
  })
  const [draft, setDraft] = useState<BirthDateDraft>(EMPTY_BIRTH_DATE)

  const day = known.data?.day ?? null
  const month = known.data?.month ?? null
  const knownBirthday = day !== null && month !== null ? { day, month } : null
  const date = knownBirthday ? { ...draft, ...knownBirthday } : draft

  const save = useMutation({
    mutationFn: () => {
      if (!isWholeDate(date)) throw new Error("Pick your full date of birth.")
      return setBirthDate({
        birthDay: date.day,
        birthMonth: date.month,
        birthYear: date.year,
      })
    },
    onSuccess: () => {
      void resetMe()
      router.replace(HOME_PATH)
    },
    onError: (error) => {
      if (isSuspended(error)) router.replace(SUSPENDED_PATH)
    },
  })

  return {
    loading: known.isPending,
    failed: known.isError,
    retry: () => void known.refetch(),
    draft,
    setDraft,
    knownBirthday,
    canSave: isWholeDate(date),
    saving: save.isPending,
    save: () => {
      if (!isWholeDate(date)) return
      confirm({
        ...birthDateCheck(date, new Date()),
        cancelLabel: "Change it",
        actions: [{ label: "That's right", onPress: () => save.mutate() }],
      })
    },
    error:
      save.isError && !isSuspended(save.error)
        ? getErrorMessage(save.error)
        : null,
    signingOut: logout.isPending,
    signOut: () => logout.mutate(),
  }
}
