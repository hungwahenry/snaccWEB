"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { formatNaira, koboToInput } from "@/lib/format"
import type { CampusPrice } from "../types"
import { priceProblem, toPriceKobo } from "../utils/prices"

function PriceForm({
  price,
  onSubmit,
}: {
  price: CampusPrice
  onSubmit: (kobo: number) => Promise<unknown>
}) {
  const [raw, setRaw] = useState(() =>
    koboToInput(price.price_per_thousand_kobo)
  )
  const kobo = toPriceKobo(raw)
  const problem = priceProblem(raw)

  return (
    <DialogForm
      submitLabel="Save price"
      canSubmit={kobo !== null}
      onSubmit={() => (kobo !== null ? onSubmit(kobo) : undefined)}
    >
      <TextField
        label="Price per 1,000 views (₦)"
        inputMode="decimal"
        hint={
          problem ? (
            <span className="text-destructive">{problem}</span>
          ) : (
            "In steps of ₦10."
          )
        }
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
      />
    </DialogForm>
  )
}

export function PriceDialog({
  price,
  trigger,
  disabled,
  onSubmit,
}: {
  price: CampusPrice
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (kobo: number) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={price.university.name}
      description={`Now ${formatNaira(price.price_per_thousand_kobo)} per 1,000 views${price.custom ? "" : ", the default"}. Each view is charged at the price when it happens, so running promotions pay the new price from their next view.`}
    >
      <PriceForm price={price} onSubmit={onSubmit} />
    </FormDialog>
  )
}
