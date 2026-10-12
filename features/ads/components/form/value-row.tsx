import { ChevronRightIcon } from "lucide-react"

export function ValueRow({
  label,
  value,
  onPress,
}: {
  label: string
  value: string
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`${label}, ${value}`}
      className="flex h-12 items-center justify-between gap-3 rounded-xl bg-input px-4 transition-opacity hover:opacity-80"
    >
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1 text-sm font-bold text-foreground">
        <span className="truncate">{value}</span>
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
      </span>
    </button>
  )
}
