/** Pinned, not `undefined`: server and browser must format identically or hydration mismatches. */
const LOCALE = "en-NG"

function upperMeridiem(value: string): string {
  return value.replace(/\b[ap]\.?m\.?\b/gi, (match) => match.toUpperCase())
}

export function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString(LOCALE, { maximumFractionDigits: 2 })}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE)
}

export function compactCount(value: number): string {
  if (value < 1000) return String(value)
  if (value < 1_000_000) return `${trimOne(value / 1000)}K`
  return `${trimOne(value / 1_000_000)}M`
}

function trimOne(value: number): string {
  return (Math.round(value * 10) / 10).toString()
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
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
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
    }),
  )
}

export function handleOf(author: { username: string | null; display_name: string | null }): string {
  return author.username ? `@${author.username}` : (author.display_name ?? "unknown")
}
