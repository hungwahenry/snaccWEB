"use client"

import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/auth/hooks/use-me"
import { BackHeader } from "@/features/navigation/components/back-header"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { BirthdayForm } from "../components/birthday-form"
import { useBirthdayForm } from "../hooks/use-birthday-form"

export function EditBirthdayScreen() {
  const back = useBack("/edit-profile")
  const profile = useMe().data?.profile

  return (
    <>
      <BackHeader title="Birthday" onBack={back} />
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
  const form = useBirthdayForm(profile)

  return (
    <BirthdayForm
      locked={form.locked}
      birthday={form.birthday}
      onChangeBirthday={form.setBirthday}
      celebrate={form.celebrate}
      onChangeCelebrate={form.setCelebrate}
      valid={form.valid}
      submitting={form.submitting}
      onSubmit={form.onSubmit}
    />
  )
}
