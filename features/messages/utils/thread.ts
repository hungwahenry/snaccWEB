import { clockTime, dayLabel, sameDay } from "@/lib/format"
import { MINUTE_MS } from "@/lib/duration"
import type { Message } from "../types"

const BURST_MS = 5 * MINUTE_MS

export interface ThreadItem {
  message: Message
  dayBreak: string | null
  time: string | null
  firstInBurst: boolean
  lastInBurst: boolean
}

export function decorateThread(
  newestFirst: Message[],
  hasOlder: boolean
): ThreadItem[] {
  const items = newestFirst.map((message, index) => {
    const older = newestFirst[index + 1]
    const newer = newestFirst[index - 1]
    const lastInBurst = !continuesBurst(message, newer)

    return {
      message,
      dayBreak: older
        ? sameDay(message.created_at, older.created_at)
          ? null
          : dayLabel(message.created_at)
        : hasOlder
          ? null
          : dayLabel(message.created_at),
      // Timed while still sending too, so settling cannot change the bubble's height.
      time:
        message.status !== "failed" && lastInBurst
          ? clockTime(message.created_at)
          : null,
      firstInBurst: !older || !continuesBurst(older, message),
      lastInBurst,
    }
  })

  return items.reverse()
}

function continuesBurst(message: Message, newer: Message | undefined): boolean {
  if (!newer || newer.mine !== message.mine) return false
  if (!sameDay(message.created_at, newer.created_at)) return false
  return (
    Date.parse(newer.created_at) - Date.parse(message.created_at) < BURST_MS
  )
}
