"use client"

import { SearchSelectField } from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"

export function CountryField({
  value,
  onChange,
  countries,
}: {
  value: string | null
  onChange: (countryCode: string) => void
  countries: Option[]
}) {
  return (
    <SearchSelectField
      label="Country"
      value={value}
      onChange={onChange}
      options={countries}
      placeholder="Search countries"
      empty="No country by that name."
    />
  )
}
