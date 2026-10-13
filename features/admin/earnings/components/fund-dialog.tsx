"use client"

import type { ReactElement, ReactNode } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { Option } from "@/features/admin/shell/types"
import { currencySymbol, formatMoney } from "@/lib/money"
import type { AdminFund, FundInput } from "../types"
import { capProblem, fundDraft, toFundInput } from "../utils/earnings"

function problem(message: string | null): ReactNode {
  return message ? <span className="text-destructive">{message}</span> : null
}

function FundForm({
  fund,
  campuses,
  currencies,
  onSubmit,
}: {
  fund?: AdminFund
  campuses: Option[]
  currencies: Record<string, string>
  onSubmit: (input: FundInput) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => fundDraft(fund))
  const currency = fund?.cap.currency ?? currencies[draft.universityId] ?? null
  const input = toFundInput(draft, currency)

  return (
    <DialogForm
      submitLabel={fund ? "Save" : "Provision"}
      canSubmit={input !== null}
      onSubmit={() => (input ? onSubmit(input) : undefined)}
    >
      {fund ? null : (
        <SelectField
          label="Campus"
          value={draft.universityId || null}
          onChange={(universityId) => set("universityId", universityId)}
          options={campuses}
          placeholder="Select a campus"
        />
      )}
      <TextField
        label={currency ? `Cap (${currencySymbol(currency)})` : "Cap"}
        inputMode="decimal"
        hint={problem(capProblem(draft.cap, currency))}
        {...text("cap")}
      />
    </DialogForm>
  )
}

/** Provisions a campus fund, or adjusts the cap of the one given. */
export function FundDialog({
  fund,
  campuses = [],
  currencies = {},
  trigger,
  disabled,
  onSubmit,
}: {
  fund?: AdminFund
  campuses?: Option[]
  currencies?: Record<string, string>
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: FundInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title={fund ? fund.university.name : "Provision campus fund"}
      description={
        fund
          ? `Distributed so far ${formatMoney(fund.distributed)}.`
          : "Creating a fund switches the campus into paid mode."
      }
    >
      <FundForm
        fund={fund}
        campuses={campuses}
        currencies={currencies}
        onSubmit={onSubmit}
      />
    </FormDialog>
  )
}
