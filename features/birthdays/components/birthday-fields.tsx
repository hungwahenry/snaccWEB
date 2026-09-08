import { cn } from "@/lib/utils"
import { daysIn, MONTH_SHORT } from "../utils/options"

export interface BirthdayDraft {
  day: number | null
  month: number | null
}

export const EMPTY_BIRTHDAY: BirthdayDraft = { day: null, month: null }

export function isComplete(
  draft: BirthdayDraft
): draft is { day: number; month: number } {
  return draft.day !== null && draft.month !== null
}

function Cell({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      aria-pressed={selected}
      className={cn(
        "flex h-9 items-center justify-center rounded-lg text-sm font-bold transition-opacity",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent",
        disabled ? "opacity-50" : "active:opacity-70"
      )}
    >
      {label}
    </button>
  )
}

export function BirthdayFields({
  value,
  onChange,
  disabled,
}: {
  value: BirthdayDraft
  onChange: (next: BirthdayDraft) => void
  disabled?: boolean
}) {
  const days = daysIn(value.month)

  function pickMonth(month: number) {
    const day = value.day && value.day > daysIn(month) ? null : value.day
    onChange({ month, day })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
          Month
        </p>
        <div className="grid grid-cols-6 gap-1">
          {MONTH_SHORT.map((label, index) => (
            <Cell
              key={label}
              label={label}
              selected={value.month === index + 1}
              disabled={disabled}
              onPress={() => pickMonth(index + 1)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
          Day
        </p>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: days }, (_, index) => (
            <Cell
              key={index + 1}
              label={String(index + 1)}
              selected={value.day === index + 1}
              disabled={disabled}
              onPress={() => onChange({ ...value, day: index + 1 })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
