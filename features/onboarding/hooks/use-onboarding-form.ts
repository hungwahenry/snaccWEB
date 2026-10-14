"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { resetMe } from "@/features/auth/cache"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMe } from "@/features/auth/hooks/use-me"
import { buildAvatarUrl } from "@/features/avatar/utils/dicebear"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { HOUR_MS } from "@/lib/duration"
import { useCampusPicker } from "@/features/universities/hooks/use-campus-picker"
import type { BirthDateDraft } from "@/features/birthdays/types"
import {
  birthDateCheck,
  EMPTY_BIRTH_DATE,
  isWholeDate,
} from "@/features/birthdays/utils/birth-date"
import { confirm } from "@/components/ui/confirm"
import { pickImage, type PickedImage } from "@/lib/media"
import { useCompleteProfile } from "./use-complete-profile"
import { useUsernameField } from "./use-username-field"
import { isApiError } from "@/lib/api/errors"
import { showError, showErrorMessage } from "@/lib/feedback"
import { useAgeRefusal } from "./use-age-refusal"
import { HOME_PATH } from "@/features/feed/routes"

const BIRTHDAY_STEP = 1
const TOTAL_STEPS = 3

export function useOnboardingForm() {
  const router = useRouter()
  const me = useMe()
  const complete = useCompleteProfile()
  const logout = useLogout()
  const age = useAgeRefusal(
    useConfigValue("onboarding.age_refusal_cooldown_hours") * HOUR_MS
  )

  const [step, setStep] = useState(0)
  const [avatar, setAvatar] = useState<PickedImage | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [birthDate, setBirthDate] = useState<BirthDateDraft>(EMPTY_BIRTH_DATE)
  const usernameField = useUsernameField()
  const [graduated, setGraduated] = useState(false)
  const [graduationYear, setGraduationYear] = useState<number | null>(null)
  const campus = useCampusPicker()
  const university = campus.selected

  const avatarBase = useConfigValue("avatar.base")
  const avatarStyle = useConfigValue("avatar.style")
  const avatarFormat = useConfigValue("avatar.format")

  const avatarUri =
    avatar?.uri ??
    (usernameField.username.length > 0
      ? buildAvatarUrl(
          avatarBase,
          avatarStyle,
          avatarFormat,
          usernameField.username
        )
      : (me.data?.profile?.avatar_url ?? null))

  async function pickAvatar() {
    try {
      const picked = await pickImage()
      if (picked) setAvatar(picked)
    } catch {
      showErrorMessage("Could not read that image.")
    }
  }

  function toggleGraduated(next: boolean) {
    setGraduated(next)
    if (!next) setGraduationYear(null)
  }

  const stepValid = [
    displayName.trim().length > 0 && usernameField.status === "available",
    isWholeDate(birthDate),
    university !== null && (!graduated || graduationYear !== null),
  ][step]

  const isLast = step === TOTAL_STEPS - 1

  function back() {
    if (step > 0) setStep(step - 1)
  }

  function next() {
    if (!stepValid || complete.isPending) return

    if (step === BIRTHDAY_STEP && isWholeDate(birthDate)) {
      confirm({
        ...birthDateCheck(birthDate, new Date()),
        cancelLabel: "Change it",
        actions: [{ label: "That's right", onPress: () => setStep(step + 1) }],
      })
      return
    }

    if (!isLast) {
      setStep(step + 1)
      return
    }
    if (!university || !isWholeDate(birthDate)) return

    complete.mutate(
      {
        username: usernameField.debounced,
        displayName: displayName.trim(),
        universityId: university.id,
        avatar,
        graduated,
        graduationYear: graduationYear ?? undefined,
        birthDay: birthDate.day,
        birthMonth: birthDate.month,
        birthYear: birthDate.year,
      },
      {
        onSuccess: () => {
          void resetMe()
          router.replace(HOME_PATH)
        },
        onError: (error) => {
          if (isApiError(error) && error.code === "under_minimum_age") {
            age.refuse()
            return
          }
          showError(error)
        },
      }
    )
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    isLast,
    stepValid,
    submitting: complete.isPending,
    refused: age.refused,
    back,
    next,
    logout: () => logout.mutate(),
    loggingOut: logout.isPending,
    clearRefusal: age.clear,

    avatarUri,
    pickAvatar,
    displayName,
    setDisplayName,
    username: usernameField.username,
    changeUsername: usernameField.change,
    usernameStatus: usernameField.status,

    birthDate,
    setBirthDate,

    campus,
    graduated,
    toggleGraduated,
    graduationYear,
    selectGraduationYear: setGraduationYear,
  }
}
