import type { TrayEntry } from "../types"

export function trayOrder(entries: TrayEntry[]): TrayEntry[] {
  const mine = entries.find((entry) => entry.mine)
  const others = entries.filter((entry) => !entry.mine)

  return mine ? [mine, ...others] : others
}

export function playQueue(entries: TrayEntry[]): TrayEntry[] {
  return trayOrder(entries)
}

export function nextUnseen(queue: TrayEntry[], from: number): number {
  return queue.findIndex((entry, at) => at > from && entry.unseen > 0)
}

/** When the first ring in the tray runs out, so the tray can drop it on time. */
export function soonestExpiry(entries: TrayEntry[]): number | null {
  const times = entries
    .map((entry) => Date.parse(entry.next_expiry_at))
    .filter(Number.isFinite)

  return times.length > 0 ? Math.min(...times) : null
}
