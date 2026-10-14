"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMe } from "@/features/auth/hooks/use-me"
import { buildAvatarUrl } from "@/features/avatar/utils/dicebear"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useClaimReferral } from "@/features/referrals/hooks/use-claim-referral"
import { useInviteCodeField } from "@/features/referrals/hooks/use-invite-code-field"
import { useReferralOverview } from "@/features/referrals/hooks/use-referrals"
import {
  inviteCodeSettled,
  inviteMessage,
  rewardBlurb,
} from "@/features/referrals/utils/invite"
import { useCampusPicker } from "@/features/universities/hooks/use-campus-picker"
import type { BirthDateDraft } from "@/features/birthdays/types"
import {
  birthDateCheck,
  EMPTY_BIRTH_DATE,
  isWholeDate,
} from "@/features/birthdays/utils/birth-date"
import { confirm } from "@/components/ui/confirm"
import { pickImage, type PickedImage } from "@/lib/media"
import { copyLink, shareOrCopy } from "@/lib/share-links"
import { useCompleteProfile } from "./use-complete-profile"
import { useUsernameField } from "./use-username-field"
import { isApiError } from "@/lib/api/errors"
import { showError, showErrorMessage } from "@/lib/feedback"
import { useAgeRefusal } from "./use-age-refusal"
import { HOME_PATH } from "@/features/feed/routes"

const BIRTHDAY_STEP = 1

export function useOnboardingForm() {
  const router = useRouter()
  const me = useMe()
  const complete = useCompleteProfile()
  const logout = useLogout()
  const age = useAgeRefusal()

  const [step, setStep] = useState(0)
  const [avatar, setAvatar] = useState<PickedImage | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [birthDate, setBirthDate] = useState<BirthDateDraft>(EMPTY_BIRTH_DATE)
  const usernameField = useUsernameField()
  const [graduated, setGraduated] = useState(false)
  const [graduationYear, setGraduationYear] = useState<number | null>(null)
  const campus = useCampusPicker()
  const university = campus.selected
  const invitesOn = useFlag("referrals")
  const invite = useInviteCodeField()
  const claimInvite = useClaimReferral()
  const own = useReferralOverview(invitesOn)

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

  const totalSteps = invitesOn ? 4 : 3
  const stepValid = [
    displayName.trim().length > 0 && usernameField.status === "available",
    isWholeDate(birthDate),
    university !== null && (!graduated || graduationYear !== null),
    inviteCodeSettled(invite.status),
  ][step]

  const isLast = step === totalSteps - 1

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
          router.replace(HOME_PATH)
          if (invitesOn && invite.value) claimInvite.mutate(invite.value)
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

  const ownCode = own.data

  return {
    step,
    totalSteps,
    isLast,
    stepValid,
    submitting: complete.isPending,
    refused: age.refused,
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

    birthDate,
    setBirthDate,

    campus,
    graduated,
    toggleGraduated,
    graduationYear,
    selectGraduationYear: setGraduationYear,

    invite: invitesOn
      ? {
          field: invite,
          own: ownCode
            ? {
                code: ownCode.code,
                blurb: rewardBlurb(ownCode.reward, ownCode.qualify_days),
                onShare: () =>
                  void shareOrCopy(
                    ownCode.link,
                    inviteMessage(ownCode.code),
                    "Your invite link"
                  ),
                onCopy: () => void copyLink(ownCode.link, "Your invite link"),
              }
            : null,
        }
      : null,
  }
}

export type OnboardingInvite = NonNullable<
  ReturnType<typeof useOnboardingForm>["invite"]
>
