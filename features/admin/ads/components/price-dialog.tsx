"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import { formatMoney, moneyToInput, type Money } from "@/lib/money"
import type { CampusPrice } from "../types"
import { priceHint, priceProblem, toPrice } from "../utils/prices"

function PriceForm({
  price,
  onSubmit,
}: {
  price: CampusPrice
  onSubmit: (price: Money) => Promise<unknown>
}) {
  const { currency } = price.price_per_thousand
  const [raw, setRaw] = useState(() => moneyToInput(price.price_per_thousand))
  const typed = toPrice(raw, currency)
  const problem = priceProblem(raw, currency)

  return (
    <DialogForm
      submitLabel="Save price"
      canSubmit={typed !== null}
      onSubmit={() => (typed !== null ? onSubmit(typed) : undefined)}
    >
      <TextField
        label="Price per 1,000 views"
        inputMode="decimal"
        hint={
          problem ? (
            <span className="text-destructive">{problem}</span>
          ) : (
            priceHint(currency)
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
  onSubmit: (price: Money) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={price.university.name}
      description={`Now ${formatMoney(price.price_per_thousand)} per 1,000 views${price.custom ? "" : ", the default"}. Each view is charged at the price when it happens, so running promotions pay the new price from their next view.`}
    >
      <PriceForm price={price} onSubmit={onSubmit} />
    </FormDialog>
  )
}
