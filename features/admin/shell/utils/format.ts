import { formatNaira, formatNumber } from "@/lib/format"
import { DAY_MS } from "@/lib/duration"

/** "1 report", "3 reports". The plural is the singular plus "s" unless given. */
export function plural(count: number, one: string, many = `${one}s`): string {
  return `${formatNumber(count)} ${count === 1 ? one : many}`
}

/** The first stretch of an id, enough to tell rows apart at a glance. */
export function shortId(id: string, length = 8): string {
  return id.length > length ? `${id.slice(0, length)}…` : id
}

/** A snake_case or kebab-case key as words: "chat_message" becomes "Chat message". */
export function humanize(key: string): string {
  const words = key.replace(/[_-]+/g, " ").trim()

  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Milliseconds on a clock face: 83000 is "1:23". */
export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))

  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** How long something has been running, to the minute: "2d 3h 5m". */
export function uptime(seconds: number): string {
  const days = Math.floor(seconds / 86_400)
  const hours = Math.floor((seconds % 86_400) / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)

  return [days && `${days}d`, hours && `${hours}h`, `${minutes}m`]
    .filter(Boolean)
    .join(" ")
}

/** A span of minutes the way a person would say it: "a day", "3 hours", "45 min". */
export function describeMinutes(minutes: number): string {
  if (minutes > 0 && minutes % 1_440 === 0) {
    const days = minutes / 1_440
    return days === 1 ? "a day" : `${days} days`
  }
  if (minutes > 0 && minutes % 60 === 0) {
    const hours = minutes / 60
    return hours === 1 ? "an hour" : `${hours} hours`
  }

  return `${minutes} min`
}

/** Whole days between an earlier moment and now. */
export function daysSince(iso: string, now = Date.now()): number {
  return Math.max(0, Math.floor((now - Date.parse(iso)) / DAY_MS))
}

/** A money movement with its direction: "+₦500" or "−₦500". */
export function signedNaira(kobo: number): string {
  if (kobo === 0) return formatNaira(0)

  return `${kobo > 0 ? "+" : "−"}${formatNaira(Math.abs(kobo))}`
}
