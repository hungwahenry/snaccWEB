import { SearchXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import type { University } from "@/features/universities/types"
import { GraduationYearSelect } from "@/features/users/components/graduation-year-select"
import { cn } from "@/lib/utils"

type UniversityStepProps = {
  search: string
  onSearch: (next: string) => void
  results: University[]
  loading: boolean
  selected: University | null
  onSelect: (university: University) => void
  onClear: () => void
  graduated: boolean
  onToggleGraduated: (next: boolean) => void
  graduationYear: number | null
  onSelectGraduationYear: (year: number) => void
}

export function UniversityStep({
  search,
  onSearch,
  results,
  loading,
  selected,
  onSelect,
  onClear,
  graduated,
  onToggleGraduated,
  graduationYear,
  onSelectGraduationYear,
}: UniversityStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Which campus is yours?
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Where you study now, or where you graduated from.
        </p>
      </div>

      {selected ? (
        <button
          type="button"
          onClick={onClear}
          className="flex h-14 items-center justify-between rounded-full bg-input px-5 text-left"
        >
          <span className="flex-1 truncate font-semibold text-foreground">
            {selected.name}
          </span>
          <span className="ml-3 text-sm font-semibold text-muted-foreground">
            Change
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search your university"
              autoFocus
              className="h-14 rounded-full px-5 text-base md:text-base"
            />
            {loading ? (
              <Spinner className="absolute top-1/2 right-5 -translate-y-1/2 text-muted-foreground" />
            ) : null}
          </div>
          <UniversityResults
            search={search}
            results={results}
            loading={loading}
            onSelect={onSelect}
          />
        </div>
      )}

      <div className={cn("flex flex-col gap-5", !selected && "opacity-50")}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              I&apos;ve already graduated 🎓
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              {selected
                ? "Alumni are welcome. Add the year you finished."
                : "Pick your campus first, then flip this on."}
            </p>
          </div>
          <Switch
            checked={graduated}
            onCheckedChange={onToggleGraduated}
            disabled={!selected}
          />
        </div>

        {graduated ? (
          <GraduationYearSelect
            value={graduationYear}
            onChange={onSelectGraduationYear}
          />
        ) : null}
      </div>
    </div>
  )
}

function UniversityResults({
  search,
  results,
  loading,
  onSelect,
}: {
  search: string
  results: University[]
  loading: boolean
  onSelect: (university: University) => void
}) {
  if (search.trim().length === 0) return null
  if (loading && results.length === 0) return null

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
          className="rounded-2xl px-4 py-3 text-left transition-colors hover:bg-accent"
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
