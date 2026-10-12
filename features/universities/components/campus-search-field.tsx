import { SearchXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { University } from "../types"

export function CampusSearchField({
  search,
  onSearch,
  searching,
  results,
  selected,
  onSelect,
  autoFocus,
}: {
  search: string
  onSearch: (next: string) => void
  searching: boolean
  results: University[]
  selected: University | null
  onSelect: (university: University | null) => void
  autoFocus?: boolean
}) {
  if (selected) {
    return (
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="flex h-14 items-center justify-between rounded-full bg-input px-5 text-left transition-opacity active:opacity-80"
      >
        <span className="flex-1 truncate font-semibold text-foreground">
          {selected.name}
        </span>
        <span className="ml-3 text-sm font-semibold text-muted-foreground">
          Change
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search your university"
          autoCorrect="off"
          autoFocus={autoFocus}
          className="h-14 rounded-full px-5 text-base md:text-base"
        />
        {searching ? (
          <Spinner className="absolute top-1/2 right-5 -translate-y-1/2 text-muted-foreground" />
        ) : null}
      </div>
      <CampusResults
        search={search}
        searching={searching}
        results={results}
        onSelect={onSelect}
      />
    </div>
  )
}

function CampusResults({
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
  if (search.trim().length === 0) return null
  if (searching && results.length === 0) return null

  if (results.length === 0) {
    return (
      <EmptyState
        compact
        icon={SearchXIcon}
        title="No match. Try the acronym."
        className="py-4"
      />
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {results.map((university) => (
        <button
          key={university.id}
          type="button"
          onClick={() => onSelect(university)}
          className="rounded-2xl px-4 py-3 text-left transition-colors hover:bg-accent active:bg-accent"
        >
          <p className="truncate font-semibold text-foreground">
            {university.name}
          </p>
          <p className="text-xs text-muted-foreground">{university.acronym}</p>
        </button>
      ))}
    </div>
  )
}
