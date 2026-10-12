import { GraduationCapIcon, SearchXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import type { University } from "../types"
import { CampusResultRow } from "./campus-result-row"

export function CampusResults({
  search,
  searching,
  results,
  onSelect,
}: {
  search: string
  searching: boolean
  results: University[]
  onSelect: (university: University) => void
}) {
  if (search.trim().length === 0) {
    return (
      <EmptyState
        icon={GraduationCapIcon}
        title="Find your campus"
        description="Search by its full name or its acronym."
      />
    )
  }
  if (searching && results.length === 0) return null

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="No campus matches that"
        description="Check the spelling, or try its acronym."
      />
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {results.map((university) => (
        <CampusResultRow
          key={university.id}
          university={university}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
