const LOCALE = "en-NG"

function upperMeridiem(value: string): string {
  return value.replace(/\b[ap]\.?m\.?\b/gi, (match) => match.toUpperCase())
}

export function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString(LOCALE, { maximumFractionDigits: 2 })}`
}

export function koboToInput(kobo: number): string {
  const whole = Math.floor(kobo / 100)
  const minor = kobo % 100
  return minor === 0
    ? String(whole)
    : `${whole}.${String(minor).padStart(2, "0")}`
}

export function nairaToKobo(raw: string): number {
  const [whole = "", fraction = ""] = raw.split(".")
  if (!/^\d*$/.test(whole) || !/^\d*$/.test(fraction)) return 0

  return Number(whole || "0") * 100 + Number((fraction + "00").slice(0, 2))
}

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE)
}

export function compactCount(value: number): string {
  if (value < 1000) return String(value)
  if (value < 1_000_000) return `${trimOne(value / 1000)}k`
  return `${trimOne(value / 1_000_000)}m`
}

function trimOne(value: number): string {
  return (Math.floor(value * 10) / 10).toString().replace(/\.0$/, "")
}

export function shortDate(iso: string): string {
  const date = new Date(iso)
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric"

  return date.toLocaleDateString(LOCALE, options)
}

export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function timeAgo(iso: string): string {
  const secs = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  )
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return shortDate(iso)
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—"

  return upperMeridiem(
    new Date(iso).toLocaleString(LOCALE, {
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

export function clockTime(iso: string): string {
  return upperMeridiem(
    new Date(iso).toLocaleTimeString(LOCALE, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  )
}

export function dayLabel(iso: string): string {
  const date = new Date(iso)
  const days = Math.round((midnight(new Date()) - midnight(date)) / 86_400_000)

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return date.toLocaleDateString(LOCALE, { weekday: "long" })

  return shortDate(iso)
}
