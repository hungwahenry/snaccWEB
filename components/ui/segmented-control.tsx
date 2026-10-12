import { cn } from "@/lib/utils"

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex gap-1 rounded-full bg-card p-1", className)}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
            option.value === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
