"use client"

import { useMemo, useState } from "react"
import {
  addMonths,
  calendarDays,
  canShowNextMonth,
  canShowPrevMonth,
  fromTwelveHour,
  HOUR_WHEEL,
  MERIDIEM_WHEEL,
  minuteWheel,
  roundUpToStep,
  startOfMonth,
  toTwelveHour,
  WEEKDAY_INITIALS,
  withDate,
  withTime,
  type DateTimeStep,
  type Meridiem,
} from "@/lib/calendar"
import { monthYear, weekdayDate } from "@/lib/format"
import { useNow } from "./use-now"

const TODAY_TICK_MS = 60_000

export function useDateTimePicker({
  initial,
  min,
  max,
  minuteStep = 5,
}: {
  initial: () => Date
  min: Date
  max: Date
  minuteStep?: number
}) {
  const now = useNow(TODAY_TICK_MS)
  const [step, setStep] = useState<DateTimeStep>("date")
  const [value, setValue] = useState(() => roundUpToStep(initial(), minuteStep))
  const [month, setMonth] = useState(() => startOfMonth(value))

  const minTime = min.getTime()
  const maxTime = max.getTime()
  const valueTime = value.getTime()
  const days = useMemo(
    () =>
      calendarDays(month, {
        min: new Date(minTime),
        max: new Date(maxTime),
        today: new Date(now),
        selected: new Date(valueTime),
      }),
    [month, minTime, maxTime, now, valueTime]
  )
  const minutes = useMemo(() => minuteWheel(minuteStep), [minuteStep])
  const twelve = toTwelveHour(value.getHours())
  const tooSoon = valueTime < minTime
  const tooLate = valueTime > maxTime

  function reset(next: Date) {
    const rounded = roundUpToStep(next, minuteStep)
    setValue(rounded)
    setMonth(startOfMonth(rounded))
    setStep("date")
  }

  return {
    value,
    tooSoon,
    reset,
    props: {
      step,
      monthLabel: monthYear(month.toISOString()),
      weekdays: WEEKDAY_INITIALS,
      days,
      canGoPrev: canShowPrevMonth(month, min),
      canGoNext: canShowNextMonth(month, max),
      onPrevMonth: () => setMonth((current) => addMonths(current, -1)),
      onNextMonth: () => setMonth((current) => addMonths(current, 1)),
      onPickDay: (date: Date) => setValue((current) => withDate(current, date)),
      onNext: () => setStep("time"),
      dateLabel: weekdayDate(value.toISOString()),
      onBack: () => setStep("date"),
      hour: twelve.hour,
      minute: value.getMinutes(),
      meridiem: twelve.meridiem,
      hours: HOUR_WHEEL,
      minutes,
      meridiems: MERIDIEM_WHEEL,
      onHour: (hour: number) =>
        setValue((current) =>
          withTime(
            current,
            fromTwelveHour(hour, toTwelveHour(current.getHours()).meridiem),
            current.getMinutes()
          )
        ),
      onMinute: (minute: number) =>
        setValue((current) => withTime(current, current.getHours(), minute)),
      onMeridiem: (meridiem: Meridiem) =>
        setValue((current) =>
          withTime(
            current,
            fromTwelveHour(toTwelveHour(current.getHours()).hour, meridiem),
            current.getMinutes()
          )
        ),
      canConfirm: !tooSoon && !tooLate,
    },
  }
}
