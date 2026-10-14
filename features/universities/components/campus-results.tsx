import { GraduationCapIcon, SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import type { CampusChoice } from "../types"
import { CampusResultRow } from "./campus-result-row"

export function CampusResults({
  search,
  searching,
  results,
  onSelect,
  onAdd,
}: {
  search: string
  searching: boolean
  results: CampusChoice[]
  onSelect: (university: CampusChoice) => void
  onAdd: (() => void) | null
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
        description={
          onAdd
            ? "Check the spelling, or add your campus if it isn't on Snacc yet."
            : "Check the spelling, or try its acronym."
        }
        action={
          onAdd ? (
            <Button variant="outline" size="sm" onClick={onAdd}>
              Add your campus
            </Button>
          ) : undefined
        }
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
      {onAdd && !searching ? (
        <button
          type="button"
          onClick={onAdd}
          className="py-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Can&apos;t find your campus?{" "}
          <span className="font-semibold text-foreground">Add it</span>
        </button>
      ) : null}
    </div>
  )
}
