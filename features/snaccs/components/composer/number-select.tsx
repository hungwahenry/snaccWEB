import type { NumberOption } from "../../types"

export function NumberSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: NumberOption[]
  onChange: (value: number) => void
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full appearance-none rounded-full bg-input px-4 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
