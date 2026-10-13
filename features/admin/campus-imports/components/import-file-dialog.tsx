"use client"

import { useId, useState, type ReactElement } from "react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  DialogForm,
  FormDialog,
} from "@/features/admin/shell/components/form-dialog"
import type { Option } from "@/features/admin/shell/types"
import { CountryField } from "./country-field"

function ImportFileForm({
  countries,
  onImport,
}: {
  countries: Option[]
  onImport: (countryCode: string, file: File) => Promise<unknown>
}) {
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const id = useId()

  return (
    <DialogForm
      submitLabel="Upload and check"
      canSubmit={countryCode !== null && file !== null}
      onSubmit={() =>
        countryCode && file ? onImport(countryCode, file) : undefined
      }
    >
      <CountryField
        value={countryCode}
        onChange={setCountryCode}
        countries={countries}
      />
      <Field>
        <FieldLabel htmlFor={id}>CSV file</FieldLabel>
        <Input
          id={id}
          type="file"
          accept=".csv,text/csv"
          aria-describedby={`${id}-hint`}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <FieldDescription id={`${id}-hint`}>
          One campus per row, up to 5,000. It needs a name column, and can have
          short name, type, region and website columns.
        </FieldDescription>
      </Field>
    </DialogForm>
  )
}

export function ImportFileDialog({
  countries,
  trigger,
  disabled,
  onImport,
}: {
  countries: Option[]
  trigger: ReactElement
  disabled?: boolean
  onImport: (countryCode: string, file: File) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Import campuses from a file"
      description="Each row is checked against the campuses already on Snacc and the public registry. Nothing changes until you review it and apply."
    >
      <ImportFileForm countries={countries} onImport={onImport} />
    </FormDialog>
  )
}
