import { clockTime, dayLabel, sameDay } from "@/lib/format"
import { MINUTE_MS } from "@/lib/duration"
import type { DeliveryState, ThreadItem, ThreadMessage } from "../types"

const BURST_MS = 5 * MINUTE_MS

interface ThreadOptions<T> {
  /** When the other person last read the thread. Rooms have no such thing, so leave it out. */
  peerReadAt?: string | null
  /** Whether two messages sit on the same side of a run: by side in a DM, by sender in a room. */
  sameSide?: (a: T, b: T) => boolean
}

const bySide = (a: ThreadMessage, b: ThreadMessage) => a.mine === b.mine

/** Sent or Seen, shown only under the newest message and only when it is yours. */
export function deliveryOf(
  newest: ThreadMessage | undefined,
  peerReadAt: string | null
): DeliveryState | null {
  if (!newest?.mine || newest.status !== undefined) return null
  return peerReadAt !== null && newest.created_at <= peerReadAt
    ? "seen"
    : "sent"
}

export function decorateThread<T extends ThreadMessage>(
  newestFirst: T[],
  hasOlder: boolean,
  { peerReadAt, sameSide = bySide }: ThreadOptions<T> = {}
): ThreadItem<T>[] {
  const delivery =
    peerReadAt === undefined ? null : deliveryOf(newestFirst[0], peerReadAt)

  const continuesBurst = (message: T, newer: T | undefined): boolean => {
    if (!newer || !sameSide(message, newer)) return false
    if (!sameDay(message.created_at, newer.created_at)) return false
    return (
      Date.parse(newer.created_at) - Date.parse(message.created_at) < BURST_MS
    )
  }

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
      delivery: index === 0 ? delivery : null,
    }
  })

  return items.reverse()
}
