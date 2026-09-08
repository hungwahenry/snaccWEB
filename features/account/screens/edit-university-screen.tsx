"use client"

import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/auth/hooks/use-me"
import { BackHeader } from "@/features/navigation/components/back-header"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { UniversityForm } from "../components/university-form"
import { useUniversityForm } from "../hooks/use-university-form"

export function EditUniversityScreen() {
  const back = useBack("/edit-profile")
  const profile = useMe().data?.profile

  return (
    <>
      <BackHeader title="Campus" onBack={back} />
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
  const form = useUniversityForm(profile)

  return (
    <UniversityForm
      locked={form.locked}
      currentName={form.currentName}
      search={form.search}
      onSearch={form.setSearch}
      searching={form.searching}
      results={form.results}
      selected={form.selected}
      onSelect={form.select}
      valid={form.valid}
      submitting={form.submitting}
      onSubmit={form.onSubmit}
    />
  )
}
