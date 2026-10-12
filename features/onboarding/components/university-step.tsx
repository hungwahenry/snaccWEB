import { Switch } from "@/components/ui/switch"
import { CampusField } from "@/features/universities/components/campus-field"
import { CampusPickerSheet } from "@/features/universities/components/campus-picker-sheet"
import type { CampusPicker } from "@/features/universities/hooks/use-campus-picker"
import { GraduationYearSelect } from "@/features/users/components/graduation-year-select"
import { cn } from "@/lib/utils"

type UniversityStepProps = {
  campus: CampusPicker
  graduated: boolean
  onToggleGraduated: (next: boolean) => void
  graduationYear: number | null
  onSelectGraduationYear: (year: number) => void
}

export function UniversityStep({
  campus,
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

      <CampusField
        placeholder="Pick your campus"
        value={campus.selected?.name ?? null}
        onPress={campus.open}
      />
      <CampusPickerSheet title="Pick your campus" {...campus.sheet} />

      <div
        className={cn("flex flex-col gap-5", !campus.selected && "opacity-50")}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              I&apos;ve already graduated 🎓
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              {campus.selected
                ? "Alumni are welcome. Add the year you finished."
                : "Pick your campus first, then flip this on."}
            </p>
          </div>
          <Switch
            checked={graduated}
            onCheckedChange={onToggleGraduated}
            disabled={!campus.selected}
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
