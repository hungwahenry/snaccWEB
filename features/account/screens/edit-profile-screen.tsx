"use client"

import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { usePremiumNudge } from "@/features/premium/hooks/use-premium-limit"
import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { EditProfileForm } from "../components/edit-profile-form"
import { useEditProfileForm } from "../hooks/use-edit-profile-form"

export function EditProfileScreen() {
  const back = useBack()
  const me = useMe()
  const profile = me.data?.profile

  return (
    <>
      <BackHeader title="Edit profile" onBack={back} />
      {profile ? (
        <Editor profile={profile} />
      ) : (
        <div className="flex justify-center py-24">
          <Spinner className="text-muted-foreground" />
        </div>
      )}
    </>
  )
}

function Editor({ profile }: { profile: Profile }) {
  const form = useEditProfileForm(profile)
  const displayNameMax = useConfigValue("profile.display_name.max_length")
  const usernameMax = useConfigValue("profile.username.max_length")
  const bioLimit = usePremiumNudge(
    "profile.bio.max_length",
    (max) => form.bio.length >= max,
    (upgrade) => `${upgrade} with Premium`
  )
  const canUploadPhoto = useFlag("profile_photo_upload")
  const canCustomizeAvatar = useFlag("avatar_customization")

  return (
    <EditProfileForm
      {...form}
      canUploadPhoto={canUploadPhoto}
      canCustomizeAvatar={canCustomizeAvatar}
      displayNameMax={displayNameMax}
      usernameMax={usernameMax}
      bioLimit={bioLimit}
      campusName={profile.university?.name ?? null}
      birthday={profile.birthday}
    />
  )
}
