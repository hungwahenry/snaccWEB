"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ChangeEmailForm } from "../components/change-email-form"
import { useChangeEmailForm } from "../hooks/use-change-email-form"

export function ChangeEmailScreen() {
  const back = useBack("/settings")
  const form = useChangeEmailForm()

  return (
    <>
      <BackHeader title="Change email" onBack={back} />
      <ChangeEmailForm
        currentEmail={form.currentEmail}
        newEmail={form.newEmail}
        onChangeNewEmail={form.setNewEmail}
        valid={form.valid}
        submitting={form.submitting}
        onSubmit={form.onSubmit}
      />
    </>
  )
}
