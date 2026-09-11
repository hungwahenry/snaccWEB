"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useUsernameField } from "@/features/onboarding/hooks/use-username-field"
import type { Gender, Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { pickImage, type PickedImage } from "@/lib/media"
import { authKeys } from "@/features/auth/utils/keys"
import { userKeys } from "@/features/users/utils/keys"
import { updateProfile } from "@/features/account/api"
import { showErrorMessage, showSuccess } from "@/lib/feedback"

export function useEditProfileForm(profile: Profile) {
  const queryClient = useQueryClient()
  const back = useBack()
  const update = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      void queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
    },
  })

  const currentUsername = profile.username ?? ""
  const [avatar, setAvatar] = useState<PickedImage | null>(null)
  const [cover, setCover] = useState<PickedImage | null>(null)
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name ?? "")
  const usernameField = useUsernameField(currentUsername, currentUsername)
  const [bio, setBio] = useState(profile.bio ?? "")
  const [major, setMajor] = useState(profile.major ?? "")
  const [graduated, setGraduated] = useState(profile.graduated)
  const [graduationYear, setGraduationYear] = useState<number | null>(
    profile.graduation_year
  )
  const [gender, setGender] = useState<Gender | "">(profile.gender ?? "")

  async function pick(setter: (image: PickedImage) => void) {
    try {
      const picked = await pickImage()
      if (picked) setter(picked)
    } catch {
      showErrorMessage("Could not read that image.")
    }
  }

  const valid =
    displayName.trim().length > 0 &&
    usernameField.status === "available" &&
    (!graduated || graduationYear !== null)

  function onSubmit() {
    if (!valid || update.isPending) return

    update.mutate(
      {
        username: usernameField.username,
        displayName: displayName.trim(),
        bio,
        major,
        graduated,
        graduationYear:
          graduated && graduationYear ? graduationYear : undefined,
        gender: gender || undefined,
        avatar,
        cover,
        ...(coverRemoved ? { removeCover: true } : {}),
      },
      {
        onSuccess: () => {
          showSuccess("Profile updated.")
          back()
        },
      }
    )
  }

  return {
    avatarUri: avatar?.uri ?? profile.avatar_url,
    pickAvatar: () => void pick(setAvatar),
    coverUri: cover?.uri ?? (coverRemoved ? null : profile.cover_url),
    pickCover: () =>
      void pick((image) => {
        setCover(image)
        setCoverRemoved(false)
      }),
    removeCover: () => {
      setCover(null)
      setCoverRemoved(true)
    },
    displayName,
    setDisplayName,
    username: usernameField.username,
    changeUsername: usernameField.change,
    usernameStatus: usernameField.status,
    bio,
    setBio,
    major,
    setMajor,
    graduated,
    toggleGraduated: (next: boolean) => {
      setGraduated(next)
      if (!next) setGraduationYear(null)
    },
    graduationYear,
    setGraduationYear,
    gender,
    setGender,
    valid,
    submitting: update.isPending,
    onSubmit,
    cancel: back,
  }
}
