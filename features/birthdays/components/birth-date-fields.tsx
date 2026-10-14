import type { ReactNode } from "react"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import type { BirthDateDraft } from "../types"
import {
  birthDays,
  birthdayLabel,
  birthMonths,
  birthYears,
  fittedDate,
} from "../utils/birth-date"

function Part({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: number | null
  onChange: (value: number) => void
  children: ReactNode
}) {
  return (
    <label className="flex flex-1 flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <NativeSelect
        size="lg"
        className="w-full"
        value={value ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        <NativeSelectOption value="" disabled>
          —
        </NativeSelectOption>
        {children}
      </NativeSelect>
    </label>
  )
}

export function BirthDateFields({
  value,
  onChange,
  known = null,
}: {
  value: BirthDateDraft
  onChange: (next: BirthDateDraft) => void
  known?: { day: number; month: number } | null
}) {
  const today = new Date()
  const change = (next: BirthDateDraft) => onChange(fittedDate(next, today))
  const year = (
    <Part
      label="Year"
      value={value.year}
      onChange={(next) => change({ ...value, year: next })}
    >
      {birthYears(today, known).map((each) => (
        <NativeSelectOption key={each} value={each}>
          {each}
        </NativeSelectOption>
      ))}
    </Part>
  )

  if (known) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base text-muted-foreground">
          Your birthday is {birthdayLabel(known)}. Just the year, then.
        </p>
        {year}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Part
        label="Day"
        value={value.day}
        onChange={(next) => change({ ...value, day: next })}
      >
        {birthDays(value.month, value.year, today).map((each) => (
          <NativeSelectOption key={each} value={each}>
            {each}
          </NativeSelectOption>
        ))}
      </Part>
      <Part
        label="Month"
        value={value.month}
        onChange={(next) => change({ ...value, month: next })}
      >
        {birthMonths(value.year, today).map((each) => (
          <NativeSelectOption key={each.value} value={each.value}>
            {each.label}
          </NativeSelectOption>
        ))}
      </Part>
      {year}
    </div>
  )
}
