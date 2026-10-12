import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { CampusPick } from "../../types"
import { RemovableChip } from "./choice-chips"

export function CampusPicker({
  picked,
  onRemove,
  search,
  onSearch,
  searching,
  results,
  onAdd,
}: {
  picked: CampusPick[]
  onRemove: (id: string) => void
  search: string
  onSearch: (next: string) => void
  searching: boolean
  results: CampusPick[]
  onAdd: (campus: CampusPick) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {picked.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {picked.map((campus) => (
            <RemovableChip
              key={campus.id}
              label={campus.acronym}
              removeLabel={`Remove ${campus.name}`}
              onRemove={() => onRemove(campus.id)}
            />
          ))}
        </div>
      ) : null}

      <div className="relative">
        <Input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={
            picked.length > 0 ? "Add another campus" : "Every campus, or search"
          }
          aria-label="Search campuses"
          autoCorrect="off"
          className="h-12 rounded-full px-5 text-base md:text-base"
        />
        {searching ? (
          <Spinner className="absolute top-1/2 right-5 -translate-y-1/2 text-muted-foreground" />
        ) : null}
      </div>

      {search.trim().length === 0 ? null : results.length === 0 ? (
        searching ? null : (
          <p className="px-5 py-2 text-xs text-muted-foreground">
            No match. Try the acronym.
          </p>
        )
      ) : (
        <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
          {results.map((university) => (
            <button
              key={university.id}
              type="button"
              onClick={() => onAdd(university)}
              className="flex flex-col rounded-2xl px-4 py-3 text-left transition-colors hover:bg-accent active:bg-accent"
            >
              <span className="truncate font-semibold text-foreground">
                {university.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {university.acronym}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
