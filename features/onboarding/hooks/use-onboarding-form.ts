"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMe } from "@/features/auth/hooks/use-me"
import { buildAvatarUrl } from "@/features/avatar/utils/dicebear"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useUniversities } from "@/features/universities/hooks/use-universities"
import type { University } from "@/features/universities/types"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { pickImage, type PickedImage } from "@/lib/media"
import { useCompleteProfile } from "./use-complete-profile"
import { useUsernameField } from "./use-username-field"

const TOTAL_STEPS = 2

export function useOnboardingForm() {
  const router = useRouter()
  const me = useMe()
  const complete = useCompleteProfile()
  const logout = useLogout()

  const [step, setStep] = useState(0)
  const [avatar, setAvatar] = useState<PickedImage | null>(null)
  const [displayName, setDisplayName] = useState("")
  const usernameField = useUsernameField()
  const [university, setUniversity] = useState<University | null>(null)
  const [search, setSearch] = useState("")
  const [graduated, setGraduated] = useState(false)
  const [graduationYear, setGraduationYear] = useState<number | null>(null)

  const avatarBase = useConfigValue("avatar.base")
  const avatarStyle = useConfigValue("avatar.style")
  const avatarFormat = useConfigValue("avatar.format")

  const debouncedSearch = useDebouncedValue(search, 300)
  const universities = useUniversities(debouncedSearch)

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
      toast.error("Could not read that image.")
    }
  }

  function selectUniversity(next: University) {
    setUniversity(next)
    setSearch("")
  }

  function clearUniversity() {
    setUniversity(null)
    setGraduated(false)
    setGraduationYear(null)
  }

  function toggleGraduated(next: boolean) {
    setGraduated(next)
    if (!next) setGraduationYear(null)
  }

  const stepValid = [
    displayName.trim().length > 0 && usernameField.status === "available",
    university !== null && (!graduated || graduationYear !== null),
  ][step]

  const isLast = step === TOTAL_STEPS - 1

  function back() {
    if (step > 0) setStep(step - 1)
  }

  function next() {
    if (!stepValid || complete.isPending) return

    if (!isLast) {
      setStep(step + 1)
      return
    }
    if (!university) return

    complete.mutate(
      {
        username: usernameField.debounced,
        displayName: displayName.trim(),
        universityId: university.id,
        avatar,
        graduated,
        graduationYear: graduationYear ?? undefined,
      },
      {
        onSuccess: () => router.replace("/home"),
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    )
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    isLast,
    stepValid,
    submitting: complete.isPending,
    back,
    next,
    logout: () => logout.mutate(),
    loggingOut: logout.isPending,

    avatarUri,
    pickAvatar,
    displayName,
    setDisplayName,
    username: usernameField.username,
    changeUsername: usernameField.change,
    usernameStatus: usernameField.status,

    search,
    setSearch,
    universities: universities.data?.items ?? [],
    universitiesLoading: universities.isFetching,
    university,
    selectUniversity,
    clearUniversity,
    graduated,
    toggleGraduated,
    graduationYear,
    selectGraduationYear: setGraduationYear,
  }
}
