function upperMeridiem(value: string): string {
  return value.replace(/\b[ap]\.?m\.?\b/gi, (match) => match.toUpperCase())
}

export function formatNumber(value: number): string {
  return value.toLocaleString(undefined)
}

export function compactCount(value: number): string {
  if (value < 1000) return String(value)
  if (value < 1_000_000) return `${trimOne(value / 1000)}k`
  return `${trimOne(value / 1_000_000)}m`
}

function trimOne(value: number): string {
  return (Math.floor(value * 10) / 10).toString().replace(/\.0$/, "")
}

/** "1 snacc", "12 snaccs", "1.2k snaccs". */
export function countLabel(
  count: number,
  singular: string,
  plural = `${singular}s`
): string {
  return `${compactCount(count)} ${count === 1 ? singular : plural}`
}

export function shortDate(iso: string): string {
  const date = new Date(iso)
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric"

  return date.toLocaleDateString(undefined, options)
}

export function longDate(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  })
}

function secondsSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
}

const WEEK_SECS = 7 * 86_400

function ageOf(secs: number): string {
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  if (days < 365) return `${Math.floor(days / 7)}w`
  return `${Math.floor(days / 365)}y`
}

export function timeAgo(iso: string): string {
  const secs = secondsSince(iso)
  return secs < WEEK_SECS ? ageOf(secs) : shortDate(iso)
}

export function relativeAge(iso: string): string {
  return ageOf(secondsSince(iso))
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—"

  return upperMeridiem(
    new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  )
}

export function handleOf(author: {
  username: string | null
  display_name: string | null
}): string {
  return author.username
    ? `@${author.username}`
    : (author.display_name ?? "unknown")
}

export function editWindowClosesAt(
  createdAt: string,
  windowMinutes: number
): number {
  return Date.parse(createdAt) + windowMinutes * 60_000
}

function midnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function sameDay(a: string, b: string): boolean {
  return midnight(new Date(a)) === midnight(new Date(b))
}

export function clockTime(iso: string, timeZone?: string): string {
  return upperMeridiem(
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    })
  )
}

export function dayLabel(iso: string): string {
  const date = new Date(iso)
  const days = Math.round((midnight(new Date()) - midnight(date)) / 86_400_000)

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return date.toLocaleDateString(undefined, { weekday: "long" })

  return shortDate(iso)
}

export function weekdayDay(iso: string, timeZone?: string): string {
  const date = new Date(iso)
  const weekday = date.toLocaleDateString(undefined, {
    weekday: "short",
    timeZone,
  })
  const day = date.toLocaleDateString(undefined, { day: "numeric", timeZone })
  return `${weekday} ${day}`
}

export function weekdayDate(iso: string, timeZone?: string): string {
  const month = new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    timeZone,
  })
  return `${weekdayDay(iso, timeZone)} ${month}`
}

export function dateAtTime(iso: string, timeZone?: string): string {
  return `${weekdayDate(iso, timeZone)} at ${clockTime(iso, timeZone)}`
}

export function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })
}

export function percent(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

/** Seconds as a length of time somebody would say out loud, not a stopwatch reading. */
export function formatDuration(seconds: number): string {
  const whole = Math.round(seconds)
  if (whole < 60) return `${whole}s`

  return `${Math.floor(whole / 60)}m ${whole % 60}s`
}

export function shortDay(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })
}

/** A bare hour of the day, written the way this browser writes times. */
export function hourLabel(hour: number): string {
  const at = new Date()
  at.setHours(hour, 0, 0, 0)

  return at
    .toLocaleTimeString(undefined, { hour: "numeric" })
    .replace(/\s/g, "")
}

/** An unread count on a badge: exact up to 99, then just "a lot". */
export function badgeCount(count: number): string {
  return count > 99 ? "99+" : String(count)
}
