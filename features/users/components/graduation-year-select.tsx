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
      <select
        value={value ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-14 w-full appearance-none rounded-full bg-input px-5 text-base text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        <option value="" disabled>
          Select your graduation year
        </option>
        {GRADUATION_YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  )
}
