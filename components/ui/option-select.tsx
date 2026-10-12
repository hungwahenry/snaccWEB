export function OptionSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <select
        value={String(value)}
        onChange={(event) => {
          const picked = options.find(
            (option) => String(option.value) === event.target.value
          )
          if (picked) onChange(picked.value)
        }}
        className="h-11 w-full appearance-none rounded-full bg-input px-4 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
