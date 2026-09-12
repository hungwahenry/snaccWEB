import { CalendarClockIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"

export function ScheduleRow({
  label,
  problem,
  onEdit,
  onClear,
}: {
  label: string
  problem: string | null
  onEdit: () => void
  onClear: () => void
}) {
  return (
    <div className="flex w-full items-center gap-2 rounded-2xl bg-muted py-2 pr-2 pl-3">
      <button
        type="button"
        onClick={onEdit}
        className="flex min-w-0 flex-1 items-center gap-2 text-left transition-opacity active:opacity-60"
      >
        <CalendarClockIcon className="size-4.5 shrink-0 text-foreground" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {label}
          </span>
          {problem ? (
            <span className="text-xs text-destructive">{problem}</span>
          ) : null}
        </span>
      </button>
      <IconButton
        icon={XIcon}
        label="Remove schedule"
        onClick={onClear}
        className="size-7 shrink-0"
        iconClassName="size-4"
      />
    </div>
  )
}
