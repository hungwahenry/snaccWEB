"use client"

import type { ReactNode } from "react"
import { SearchSelectField } from "@/features/admin/shell/components/form-fields"
import { useCampusSearch } from "../hooks/use-campus-search"
import { ANY_CAMPUS } from "../utils/university"

export function CampusSearchField({
  label,
  value,
  onChange,
  anyLabel,
  within,
  hint,
}: {
  label: string
  value: string | null
  onChange: (campusId: string | null) => void
  anyLabel?: string
  within?: readonly string[] | null
  hint?: ReactNode
}) {
  const campuses = useCampusSearch(value, anyLabel, within)

  return (
    <SearchSelectField
      label={label}
      value={value ?? (anyLabel ? ANY_CAMPUS : null)}
      onChange={(next) => onChange(next === ANY_CAMPUS ? null : next)}
      options={campuses.options}
      onSearch={campuses.search}
      placeholder="Search campuses"
      empty="No campus by that name."
      hint={hint}
    />
  )
}
