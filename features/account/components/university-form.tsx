import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CampusField } from "@/features/universities/components/campus-field"
import { CampusPickerSheet } from "@/features/universities/components/campus-picker-sheet"
import type { CampusPicker } from "@/features/universities/hooks/use-campus-picker"

export function UniversityForm({
  locked,
  currentName,
  picker,
  valid,
  submitting,
  onSubmit,
}: {
  locked: boolean
  currentName: string | null
  picker: CampusPicker
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

          <CampusField
            placeholder="Pick your new campus"
            value={picker.selected?.name ?? null}
            onPress={picker.open}
          />
          <CampusPickerSheet title="Change campus" {...picker.sheet} />
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
