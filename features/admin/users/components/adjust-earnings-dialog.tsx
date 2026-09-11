"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { formatNaira } from "@/lib/format"
import type { AdjustEarningsInput } from "../types"
import { previewAdjustment } from "@/features/admin/shell/utils/money"
import { ADJUST_REASON_MAX } from "../utils/users"

function AdjustForm({
  balance,
  onSubmit,
}: {
  balance: number
  onSubmit: (input: AdjustEarningsInput) => Promise<unknown>
}) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const preview = previewAdjustment(balance, amount)

  return (
    <DialogForm
      submitLabel="Adjust"
      canSubmit={preview.ok}
      onSubmit={() =>
        preview.ok
          ? onSubmit({
              delta: preview.delta,
              reason: reason.trim() || undefined,
            })
          : undefined
      }
    >
      <TextField
        label="Amount in naira"
        inputMode="decimal"
        placeholder="500, or -250 to take some back"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        hint={
          preview.ok
            ? `Unclaimed earnings go from ${formatNaira(balance)} to ${formatNaira(preview.next)}.`
            : (preview.message ??
              `They have ${formatNaira(balance)} unclaimed.`)
        }
      />
      <TextField
        label="Why"
        optional
        maxLength={ADJUST_REASON_MAX}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
    </DialogForm>
  )
}

export function AdjustEarningsDialog({
  balance,
  trigger,
  disabled,
  onSubmit,
}: {
  balance: number
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: AdjustEarningsInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Adjust unclaimed earnings"
      description="This changes what they have earned but not yet claimed. It is recorded against your name. To correct spendable money, use their wallet instead."
    >
      <AdjustForm balance={balance} onSubmit={onSubmit} />
    </FormDialog>
  )
}
