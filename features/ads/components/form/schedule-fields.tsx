import { ValueRow } from "./value-row"

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
      <ValueRow label="Starts" value={start} onPress={onEditStart} />
      <ValueRow label="Ends" value={end} onPress={onEditEnd} />
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
