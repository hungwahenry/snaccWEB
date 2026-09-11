"use client"

import type { ReactElement } from "react"
import { TextField } from "@/features/admin/shell/components/form-fields"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { HoldUsernameInput } from "../types"
import { isHoldReady } from "../utils/reserved-usernames"

function HoldUsernameForm({
  onSubmit,
}: {
  onSubmit: (draft: HoldUsernameInput) => Promise<unknown>
}) {
  const { draft, text } = useDraft<HoldUsernameInput>({ name: "", reason: "" })

  return (
    <DialogForm
      submitLabel="Hold it"
      canSubmit={isHoldReady(draft)}
      onSubmit={() => onSubmit(draft)}
    >
      <TextField
        label="Username"
        placeholder="snacchq"
        autoComplete="off"
        {...text("name")}
      />
      <TextField
        label="Why"
        placeholder="Could be mistaken for Snacc itself"
        {...text("reason")}
      />
    </DialogForm>
  )
}

export function HoldUsernameDialog({
  trigger,
  disabled,
  onSubmit,
}: {
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (draft: HoldUsernameInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Hold a username"
      description="Nobody will be able to take it. This only works on a name that is still free — if someone already has it, suspend the account instead."
    >
      <HoldUsernameForm onSubmit={onSubmit} />
    </FormDialog>
  )
}
