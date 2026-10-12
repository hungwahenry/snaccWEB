import { ChevronRightIcon } from "lucide-react"

function TimeRow({
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

export function ScheduleFields({
  start,
  end,
  onEditStart,
  onEditEnd,
  onStartNow,
}: {
  start: string
  end: string
  onEditStart: () => void
  onEditEnd: () => void
  onStartNow?: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <TimeRow label="Starts" value={start} onPress={onEditStart} />
      <TimeRow label="Ends" value={end} onPress={onEditEnd} />
      {onStartNow ? (
        <button
          type="button"
          onClick={onStartNow}
          className="self-start px-1 py-1 text-sm font-bold text-primary hover:underline"
        >
          Start right away instead
        </button>
      ) : null}
    </div>
  )
}
