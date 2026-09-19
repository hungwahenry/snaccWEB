const PLAY_SHARE = 0.6

export interface SeenClip<T> {
  card: T
  top: number
  share: number
}

export interface AutoplaySetting {
  flag: boolean
  reducedMotion: boolean
  savesData: boolean
}

export function allowsAutoplay(setting: AutoplaySetting): boolean {
  return setting.flag && !setting.reducedMotion && !setting.savesData
}

export function shareOf(
  ratio: number,
  visibleHeight: number,
  viewportHeight: number
): number {
  const ofViewport = viewportHeight > 0 ? visibleHeight / viewportHeight : 0
  return Math.min(1, Math.max(ratio, ofViewport))
}

export function autoplayTarget<T>(
  seen: readonly SeenClip<T>[],
  share = PLAY_SHARE
): T | null {
  let best: SeenClip<T> | null = null
  for (const clip of seen) {
    if (clip.share < share) continue
    if (!best || clip.top < best.top) best = clip
  }
  return best?.card ?? null
}
