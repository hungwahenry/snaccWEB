import { CampusField } from "@/features/universities/components/campus-field"
import { CampusPickerSheet } from "@/features/universities/components/campus-picker-sheet"
import type { CampusSheetState } from "@/features/universities/hooks/use-campus-sheet"
import type { CampusPick } from "../../types"
import { RemovableChip } from "./choice-chips"

export function CampusPicker({
  picked,
  onRemove,
  onOpen,
  sheet,
}: {
  picked: CampusPick[]
  onRemove: (id: string) => void
  onOpen: () => void
  sheet: CampusSheetState
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

      <CampusField
        placeholder={
          picked.length > 0
            ? "Add another campus"
            : "Every campus, or pick some"
        }
        value={null}
        onPress={onOpen}
      />
      <CampusPickerSheet title="Add a campus" {...sheet} />
    </div>
  )
}
