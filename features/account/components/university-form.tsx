import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { University } from "@/features/universities/types"

export function UniversityForm({
  locked,
  currentName,
  search,
  onSearch,
  searching,
  results,
  selected,
  onSelect,
  valid,
  submitting,
  onSubmit,
}: {
  locked: boolean
  currentName: string | null
  search: string
  onSearch: (next: string) => void
  searching: boolean
  results: University[]
  selected: University | null
  onSelect: (university: University | null) => void
  valid: boolean
  submitting: boolean
  onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-4 pb-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Current campus</p>
        <div className="flex h-14 items-center rounded-full bg-input px-5">
          <span className="flex-1 truncate font-semibold text-foreground">
            {currentName ?? "No campus yet"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {locked
            ? "Your campus has been changed once already. Contact support if it needs changing again."
            : "You can change your campus once. Make it count."}
        </p>
      </div>

      {locked ? null : (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">New campus</p>

          {selected ? (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="flex h-14 items-center justify-between rounded-full bg-input px-5 transition-opacity active:opacity-80"
            >
              <span className="flex-1 truncate text-left font-semibold text-foreground">
                {selected.name}
              </span>
              <span className="ml-3 text-sm font-semibold text-muted-foreground">
                Change
              </span>
            </button>
          ) : (
            <>
              <div className="relative">
                <Input
                  value={search}
                  onChange={(event) => onSearch(event.target.value)}
                  placeholder="Search your university"
                  autoCorrect="off"
                  className="h-14 rounded-full px-5 text-base md:text-base"
                />
                {searching ? (
                  <Spinner className="absolute top-1/2 right-5 -translate-y-1/2 text-muted-foreground" />
                ) : null}
              </div>

              {search.trim().length === 0 ? null : results.length === 0 ? (
                searching ? null : (
                  <p className="px-5 py-3 text-xs text-muted-foreground">
                    No match. Try the acronym.
                  </p>
                )
              ) : (
                <div className="flex flex-col gap-1">
                  {results.map((university) => (
                    <button
                      key={university.id}
                      type="button"
                      onClick={() => onSelect(university)}
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
            </>
          )}
        </div>
      )}

      {valid ? (
        <Button
          size="lg"
          className="h-14 text-base"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? <Spinner /> : "Save"}
        </Button>
      ) : null}
    </div>
  )
}
