export type ChangeTone = "up" | "down" | "flat"

function grouped(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatUsd(price: number | null): string {
  if (price === null) return "—"
  if (price >= 1000) return `$${grouped(String(Math.round(price)))}`
  if (price >= 1) return `$${price.toFixed(2)}`
  return `$${Number(price.toPrecision(3))}`
}

export function formatUsdCompact(value: number | null): string {
  if (value === null) return "—"
  if (value >= 1e12) return `$${trimmed(value / 1e12)}T`
  if (value >= 1e9) return `$${trimmed(value / 1e9)}B`
  if (value >= 1e6) return `$${trimmed(value / 1e6)}M`
  return formatUsd(value)
}

export function formatNgnPrice(price: number | null): string {
  if (price === null) return "—"
  if (price >= 1e9) return `₦${trimmed(price / 1e9)}B`
  if (price >= 1e6) return `₦${trimmed(price / 1e6)}M`
  if (price >= 1000) return `₦${grouped(String(Math.round(price)))}`
  if (price >= 1) return `₦${price.toFixed(2)}`
  return `₦${Number(price.toPrecision(3))}`
}

function trimmed(value: number): string {
  return value.toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, "")
}

export function formatChange(pct: number | null): string {
  if (pct === null) return ""
  const arrow = pct > 0 ? "▲" : pct < 0 ? "▼" : ""
  return `${arrow}${Math.abs(pct).toFixed(1)}%`
}

export function changeTone(pct: number | null): ChangeTone {
  if (pct === null || pct === 0) return "flat"
  return pct > 0 ? "up" : "down"
}
