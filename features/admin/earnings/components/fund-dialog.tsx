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
import { formatNaira } from "@/lib/format"
import type { AdminFund, FundInput } from "../types"
import { capProblem, fundDraft, toFundInput } from "../utils/earnings"

function problem(message: string | null): ReactNode {
  return message ? <span className="text-destructive">{message}</span> : null
}

function FundForm({
  fund,
  campuses,
  onSubmit,
}: {
  fund?: AdminFund
  campuses: Option[]
  onSubmit: (input: FundInput) => Promise<unknown>
}) {
  const { draft, set, text } = useDraft(() => fundDraft(fund))
  const input = toFundInput(draft)

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
        label="Cap (₦)"
        inputMode="decimal"
        hint={problem(capProblem(draft.cap))}
        {...text("cap")}
      />
    </DialogForm>
  )
}

/** Provisions a campus fund, or adjusts the cap of the one given. */
export function FundDialog({
  fund,
  campuses = [],
  trigger,
  disabled,
  onSubmit,
}: {
  fund?: AdminFund
  campuses?: Option[]
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
          ? `Distributed so far ${formatNaira(fund.distributed)}.`
          : "Creating a fund switches the campus into paid mode."
      }
    >
      <FundForm fund={fund} campuses={campuses} onSubmit={onSubmit} />
    </FormDialog>
  )
}
