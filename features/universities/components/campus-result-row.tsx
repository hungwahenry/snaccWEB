import { useCountryName } from "@/features/places/hooks/use-places"
import type { University } from "../types"

export function CampusResultRow({
  university,
  onSelect,
}: {
  university: University
  onSelect: (university: University) => void
}) {
  const country = useCountryName(university.country_code)

  return (
    <button
      type="button"
      onClick={() => onSelect(university)}
      className="rounded-2xl px-4 py-3 text-left transition-colors hover:bg-accent active:bg-accent"
    >
      <p className="truncate font-semibold text-foreground">{university.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {country ? `${university.acronym} · ${country}` : university.acronym}
      </p>
    </button>
  )
}
