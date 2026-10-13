"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import type { Option } from "@/features/admin/shell/types"
import { CountryField } from "./country-field"

function CheckCountryForm({
  countries,
  onCheck,
}: {
  countries: Option[]
  onCheck: (countryCode: string) => Promise<unknown>
}) {
  const [countryCode, setCountryCode] = useState<string | null>(null)

  return (
    <DialogForm
      submitLabel="Check"
      canSubmit={countryCode !== null}
      onSubmit={() => (countryCode ? onCheck(countryCode) : undefined)}
    >
      <CountryField
        value={countryCode}
        onChange={setCountryCode}
        countries={countries}
      />
    </DialogForm>
  )
}

export function CheckCountryDialog({
  countries,
  trigger,
  disabled,
  onCheck,
}: {
  countries: Option[]
  trigger: ReactElement
  disabled?: boolean
  onCheck: (countryCode: string) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Check a country's campuses"
      description="Every campus already on Snacc in that country is checked against the public registry. Missing details are filled in and copies are pointed out. Nothing changes until you review it and apply."
    >
      <CheckCountryForm countries={countries} onCheck={onCheck} />
    </FormDialog>
  )
}
