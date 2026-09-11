"use client"

import { ActivationForm } from "../components/receive/activation-form"
import { useActivationForm } from "../hooks/receive/use-activation-form"

export function AccountActivation({
  failureReason,
}: {
  failureReason: string | null
}) {
  const form = useActivationForm()
  return <ActivationForm {...form} failureReason={failureReason} />
}
