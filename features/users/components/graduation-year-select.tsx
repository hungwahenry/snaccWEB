import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { GRADUATION_YEARS } from "../utils/graduation-years"

export function GraduationYearSelect({
  value,
  onChange,
}: {
  value: number | null
  onChange: (year: number) => void
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">Class of</span>
      <NativeSelect
        size="lg"
        className="w-full"
        value={value ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        <NativeSelectOption value="" disabled>
          Select your graduation year
        </NativeSelectOption>
        {GRADUATION_YEARS.map((year) => (
          <NativeSelectOption key={year} value={year}>
            {year}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </label>
  )
}
