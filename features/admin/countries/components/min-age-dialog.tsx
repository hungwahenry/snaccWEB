"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { TextField } from "@/features/admin/shell/components/form-fields"
import type { AdminCountry } from "../types"
import { isMinAge } from "../utils/countries"

function MinAgeForm({
  country,
  onSave,
}: {
  country: AdminCountry
  onSave: (minAge: number) => Promise<unknown>
}) {
  const [value, setValue] = useState(String(country.min_age))
  const minAge = Number(value)

  return (
    <DialogForm
      submitLabel="Save"
      canSubmit={isMinAge(value) && minAge !== country.min_age}
      onSubmit={() => onSave(minAge)}
    >
      <TextField
        label="Minimum age"
        inputMode="numeric"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <FormNote>
        Checked when someone signs up, and when someone who joined earlier gives
        their date of birth. People already in are not checked again.
      </FormNote>
    </DialogForm>
  )
}

export function MinAgeDialog({
  country,
  onSave,
  disabled,
}: {
  country: AdminCountry
  onSave: (minAge: number) => Promise<unknown>
  disabled?: boolean
}) {
  return (
    <FormDialog
      disabled={disabled}
      trigger={
        <Button variant="ghost" size="sm" className="tabular-nums">
          {country.min_age}
        </Button>
      }
      title={`Minimum age in ${country.name}`}
      description="The youngest anyone here may be to use Snacc."
    >
      <MinAgeForm country={country} onSave={onSave} />
    </FormDialog>
  )
}
