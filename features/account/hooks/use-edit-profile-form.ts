"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useUsernameField } from "@/features/onboarding/hooks/use-username-field"
import type { Gender, Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { getErrorMessage } from "@/lib/api/errors"
import { pickImage, type PickedImage } from "@/lib/media"
import { ME_KEY } from "@/lib/query-keys"
import { updateProfile } from "@/features/account/api"

export function useEditProfileForm(profile: Profile) {
  const queryClient = useQueryClient()
  const back = useBack()
  const update = useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(ME_KEY, user)
      void queryClient.invalidateQueries({ queryKey: ["users", "profile"] })
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
      toast.error("Could not read that image.")
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
          toast.success("Profile updated.")
          back()
        },
        onError: (error) => toast.error(getErrorMessage(error)),
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
