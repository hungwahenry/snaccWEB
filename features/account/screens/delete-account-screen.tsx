"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { DeleteAccountPanel } from "../components/delete-account-panel"
import { useDeleteAccount } from "../hooks/use-delete-account"

export function DeleteAccountScreen() {
  const back = useBack("/settings")
  const { run, deleting } = useDeleteAccount()

  return (
    <>
      <BackHeader title="Delete account" onBack={back} />
      <DeleteAccountPanel deleting={deleting} onDelete={run} />
    </>
  )
}
