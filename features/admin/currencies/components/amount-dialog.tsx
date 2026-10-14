"use client"

import { useState, type ReactElement, type ReactNode } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { moneyToInput, type Money } from "@/lib/money"
import { toAmount } from "../utils/currencies"

function AmountForm({
  amount,
  currency,
  optional,
  onSubmit,
}: {
  amount: Money | null
  currency: string
  optional: boolean
  onSubmit: (amount: number | null) => Promise<unknown> | void
}) {
  const [raw, setRaw] = useState(() => (amount ? moneyToInput(amount) : ""))
  const typed = toAmount(raw, currency)
  const blank = raw.trim() === ""
  const ready = blank ? optional : typed !== null

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={ready && (typed?.amount ?? null) !== (amount?.amount ?? null)}
      onSubmit={() => onSubmit(typed?.amount ?? null)}
    >
      <TextField
        label={`Amount in ${currency}`}
        optional={optional}
        inputMode="decimal"
        placeholder={optional ? "Empty earns nothing" : undefined}
        hint={
          !blank && typed === null ? (
            <span className="text-destructive">
              Enter an amount like 500 or 250.50.
            </span>
          ) : undefined
        }
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
      />
    </DialogForm>
  )
}

export function AmountDialog({
  title,
  description,
  amount,
  currency,
  optional = false,
  trigger,
  disabled,
  onSubmit,
}: {
  title: ReactNode
  description: string
  amount: Money | null
  currency: string
  optional?: boolean
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (amount: number | null) => Promise<unknown> | void
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={title}
      description={description}
    >
      <AmountForm
        amount={amount}
        currency={currency}
        optional={optional}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
