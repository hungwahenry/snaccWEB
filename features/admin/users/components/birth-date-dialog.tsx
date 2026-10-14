"use client"

import { useState, type ReactElement } from "react"
import {
  DialogForm,
  FormDialog,
  FormNote,
} from "@/features/admin/shell/components/form-dialog"
import { SelectField } from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"
import {
  birthDays,
  birthMonths,
  birthYears,
} from "@/features/birthdays/utils/birth-date"
import type { BirthDateInput } from "../types"

function numberOptions(values: number[]): Option[] {
  return values.map((value) => ({ value: String(value), label: String(value) }))
}

function BirthDateForm({
  current,
  onSubmit,
}: {
  current: { day: number; month: number; year: number | null } | null
  onSubmit: (input: BirthDateInput) => Promise<unknown>
}) {
  const [day, setDay] = useState<string | null>(
    current ? String(current.day) : null
  )
  const [month, setMonth] = useState<string | null>(
    current ? String(current.month) : null
  )
  const [year, setYear] = useState<string | null>(
    current?.year ? String(current.year) : null
  )

  return (
    <DialogForm
      submitLabel="Save date of birth"
      canSubmit={day !== null && month !== null && year !== null}
      onSubmit={() =>
        day && month && year
          ? onSubmit({
              birthDay: Number(day),
              birthMonth: Number(month),
              birthYear: Number(year),
            })
          : undefined
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <SelectField
          label="Day"
          value={day}
          onChange={setDay}
          options={numberOptions(
            birthDays(
              month ? Number(month) : null,
              year ? Number(year) : null,
              new Date()
            )
          )}
        />
        <SelectField
          label="Month"
          value={month}
          onChange={setMonth}
          options={birthMonths(year ? Number(year) : null, new Date()).map(
            (each) => ({ value: String(each.value), label: each.label })
          )}
        />
        <SelectField
          label="Year"
          value={year}
          onChange={setYear}
          options={numberOptions(birthYears(new Date()))}
        />
      </div>
      <FormNote>
        Checked against their country&apos;s minimum age when you save. Under
        it, the account is locked; old enough, a lock that was only for their
        age comes off.
      </FormNote>
    </DialogForm>
  )
}

export function BirthDateDialog({
  current,
  trigger,
  disabled,
  onSubmit,
}: {
  current: { day: number; month: number; year: number | null } | null
  trigger: ReactElement
  disabled?: boolean
  onSubmit: (input: BirthDateInput) => Promise<unknown>
}) {
  return (
    <FormDialog
      trigger={trigger}
      disabled={disabled}
      title="Correct date of birth"
      description="For when someone typed it wrong. They can't change it themselves."
    >
      <BirthDateForm current={current} onSubmit={onSubmit} />
    </FormDialog>
  )
}
