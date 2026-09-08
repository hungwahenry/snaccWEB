import { MINUTE_MS } from "@/lib/duration"
import { clockTime, shortDate } from "@/lib/format"

export function timeLeft(
  until: string,
  now: number = Date.now()
): string | null {
  const remaining = Date.parse(until) - now
  if (remaining <= 0) return null

  const minutes = Math.ceil(remaining / MINUTE_MS)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`

  const hours = Math.ceil(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`

  const days = Math.ceil(hours / 24)
  return `${days} day${days === 1 ? "" : "s"}`
}

export function backOn(until: string): string {
  return `${shortDate(until)} at ${clockTime(until)}`
}
