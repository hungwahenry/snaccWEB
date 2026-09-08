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
