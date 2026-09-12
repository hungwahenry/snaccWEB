import { ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MonthGrid } from "@/components/ui/month-grid"
import { Spinner } from "@/components/ui/spinner"
import { TimeWheel, WheelGroup } from "@/components/ui/time-wheel"
import type {
  CalendarDay,
  DateTimeStep,
  Meridiem,
  WheelOption,
} from "@/lib/calendar"

export type DateTimePickerProps = {
  step: DateTimeStep
  monthLabel: string
  weekdays: string[]
  days: CalendarDay[]
  canGoPrev: boolean
  canGoNext: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onPickDay: (date: Date) => void
  onNext: () => void
  dateLabel: string
  onBack: () => void
  hour: number
  minute: number
  meridiem: Meridiem
  hours: WheelOption[]
  minutes: WheelOption[]
  meridiems: WheelOption<Meridiem>[]
  onHour: (hour: number) => void
  onMinute: (minute: number) => void
  onMeridiem: (meridiem: Meridiem) => void
  summary?: string
  problem?: string | null
  confirmLabel: string
  canConfirm: boolean
  confirming?: boolean
  onConfirm: () => void
}

export function DateTimePicker({
  step,
  monthLabel,
  weekdays,
  days,
  canGoPrev,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onPickDay,
  onNext,
  dateLabel,
  onBack,
  hour,
  minute,
  meridiem,
  hours,
  minutes,
  meridiems,
  onHour,
  onMinute,
  onMeridiem,
  summary,
  problem,
  confirmLabel,
  canConfirm,
  confirming = false,
  onConfirm,
}: DateTimePickerProps) {
  if (step === "date") {
    return (
      <div className="flex flex-col gap-4">
        <MonthGrid
          label={monthLabel}
          weekdays={weekdays}
          days={days}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={onPrevMonth}
          onNext={onNextMonth}
          onPick={onPickDay}
        />
        <Button className="h-12 w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 flex items-center gap-1 self-start rounded-full py-1 pr-3 pl-1 text-sm font-bold text-foreground transition-colors hover:bg-accent/60"
      >
        <ChevronLeftIcon className="size-5" />
        {dateLabel}
      </button>

      <WheelGroup>
        <TimeWheel
          label="Hour"
          options={hours}
          value={hour}
          onChange={onHour}
        />
        <TimeWheel
          label="Minute"
          options={minutes}
          value={minute}
          onChange={onMinute}
        />
        <TimeWheel
          label="AM or PM"
          options={meridiems}
          value={meridiem}
          onChange={onMeridiem}
        />
      </WheelGroup>

      {summary || problem ? (
        <div className="flex flex-col gap-0.5 px-1">
          {summary ? (
            <p className="text-sm text-muted-foreground">{summary}</p>
          ) : null}
          {problem ? (
            <p className="text-xs text-destructive">{problem}</p>
          ) : null}
        </div>
      ) : null}

      <Button
        className="h-12 w-full"
        disabled={!canConfirm || confirming}
        onClick={onConfirm}
      >
        {confirming ? <Spinner /> : confirmLabel}
      </Button>
    </div>
  )
}
