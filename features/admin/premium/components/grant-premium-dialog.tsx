"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { GrantPremiumInput } from "../types"
import { GRANT_DAYS, GRANT_DAYS_MAX, toGrantInput } from "../utils/premium"

function GrantForm({
  onSubmit,
}: {
  onSubmit: (input: GrantPremiumInput) => Promise<unknown>
}) {
  const [days, setDays] = useState(String(GRANT_DAYS))
  const [reason, setReason] = useState("")
  const input = toGrantInput(days, reason)

  return (
    <DialogForm
      submitLabel="Give Premium"
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      <TextField
        label="Days"
        inputMode="numeric"
        value={days}
        onChange={(event) => setDays(event.target.value)}
        hint={`A whole number from 1 to ${GRANT_DAYS_MAX}. Added on top of any Premium they already have.`}
      />
      <TextField
        label="Why"
        maxLength={200}
        placeholder="Won the campus quiz"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        hint="Kept on the audit log."
      />
    </DialogForm>
  )
}

export function GrantPremiumDialog({
  trigger,
  disabled,
  onSubmit,
}: {
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: GrantPremiumInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Give Premium"
      description="Writes a promotional subscription. It does not renew, nobody is charged, and it never counts as revenue."
    >
      <GrantForm onSubmit={onSubmit} />
    </FormDialog>
  )
}
