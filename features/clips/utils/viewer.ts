import type { Snacc, SnaccClip } from "@/features/snaccs/types"
import { isBusyWithKeys } from "@/lib/keyboard"

const LOAD_AHEAD = 3
const POSTERS_AHEAD = 3
const PORTRAIT_RATIO = 1.2

export const LIVE_PAGES = 3

export type PlayableClip = Snacc & { clip: SnaccClip & { hls_url: string } }

export type ViewerKey = "next" | "previous" | "pause" | "mute" | "close"

const KEYS: Record<string, ViewerKey> = {
  ArrowDown: "next",
  PageDown: "next",
  j: "next",
  ArrowUp: "previous",
  PageUp: "previous",
  k: "previous",
  " ": "pause",
  m: "mute",
  Escape: "close",
}

const PRESSABLE = "button, a, [role='button']"

export function isReadyClip(clip: SnaccClip | null | undefined): boolean {
  return !!clip && clip.status === "ready" && clip.hls_url !== null
}

export function isPlayable(
  snacc: Snacc | null | undefined
): snacc is PlayableClip {
  return !!snacc && isReadyClip(snacc.clip)
}

export function viewerQueue(
  start: Snacc | null | undefined,
  stream: Snacc[]
): PlayableClip[] {
  const rest = stream.filter(
    (snacc): snacc is PlayableClip =>
      snacc.id !== start?.id && isPlayable(snacc)
  )
  return isPlayable(start) ? [start, ...rest] : rest
}

export function wantsMore(active: number, count: number): boolean {
  return count - 1 - active < LOAD_AHEAD
}

export function clipFit(clip: {
  width: number
  height: number
}): "cover" | "contain" {
  return clip.width > 0 && clip.height / clip.width >= PORTRAIT_RATIO
    ? "cover"
    : "contain"
}

export function upcomingPosters(
  queue: PlayableClip[],
  active: number
): string[] {
  return queue
    .slice(active + 1, active + 1 + POSTERS_AHEAD)
    .map((snacc) => snacc.clip.poster_url)
    .filter((url): url is string => url !== null)
}

export function pageAt(
  scrollTop: number,
  pageHeight: number,
  count: number
): number {
  if (pageHeight <= 0 || count <= 0) return 0
  return Math.min(count - 1, Math.max(0, Math.round(scrollTop / pageHeight)))
}

export function livePages(active: number, count: number): (number | null)[] {
  const slots: (number | null)[] = Array.from(
    { length: LIVE_PAGES },
    () => null
  )
  for (const page of [active - 1, active, active + 1]) {
    if (page >= 0 && page < count) slots[page % LIVE_PAGES] = page
  }
  return slots
}

export function viewerKey(key: string): ViewerKey | null {
  return KEYS[key] ?? null
}

export function ownsKey(target: EventTarget | null, key: ViewerKey): boolean {
  if (!(target instanceof Element)) return false
  if (isBusyWithKeys(target)) return true
  return key === "pause" && target.closest(PRESSABLE) !== null
}
