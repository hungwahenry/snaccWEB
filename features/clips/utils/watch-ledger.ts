const SHOWN_MS = 300
const MAX_PER_FLUSH = 50

export interface WatchReport {
  ids: string[]
  dwellMs: Record<string, number>
  watchMs: Record<string, number>
}

interface Showing {
  id: string
  since: number
  playingSince: number | null
  played: number
  counted: boolean
}

export class WatchLedger {
  private showing: Showing | null = null
  private pending = new Map<string, { dwell: number; watch: number }>()

  show(id: string | null, now: number): void {
    if ((this.showing?.id ?? null) === id) return

    this.settle(now, true)
    this.showing = id
      ? { id, since: now, playingSince: null, played: 0, counted: false }
      : null
  }

  playing(isPlaying: boolean, now: number): void {
    const current = this.showing
    if (!current) return

    if (isPlaying && current.playingSince === null) current.playingSince = now
    if (!isPlaying && current.playingSince !== null) {
      current.played += now - current.playingSince
      current.playingSince = null
    }
  }

  take(now: number): WatchReport {
    this.settle(now, false)

    const report: WatchReport = { ids: [], dwellMs: {}, watchMs: {} }
    for (const [id, entry] of this.pending) {
      if (report.ids.length >= MAX_PER_FLUSH) break
      report.ids.push(id)
      report.dwellMs[id] = Math.round(entry.dwell)
      report.watchMs[id] = Math.round(entry.watch)
    }
    for (const id of report.ids) this.pending.delete(id)

    return report
  }

  private settle(now: number, leaving: boolean): void {
    const current = this.showing
    if (!current) return

    const dwell = now - current.since
    if (!current.counted && dwell < SHOWN_MS) {
      if (leaving) this.showing = null
      return
    }

    const played =
      current.played +
      (current.playingSince === null ? 0 : now - current.playingSince)
    const banked = this.pending.get(current.id) ?? { dwell: 0, watch: 0 }
    this.pending.set(current.id, {
      dwell: banked.dwell + dwell,
      watch: banked.watch + played,
    })

    if (leaving) {
      this.showing = null
      return
    }

    current.counted = true
    current.since = now
    current.played = 0
    if (current.playingSince !== null) current.playingSince = now
  }
}
