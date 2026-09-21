import type { PlayableClip } from "../utils/viewer"

export interface ClipUpload {
  done: () => Promise<string>
  watch: (listener: (fraction: number) => void) => () => void
  cancel: () => void
}

export interface ClipDraft {
  file: File
  posterUrl: string | null
  durationMs: number
  width: number
  height: number
  coverMs?: number
  upload: ClipUpload
}

export interface ClipPlayback {
  active: boolean
  playing: boolean
  paused: boolean
  fast: boolean
  muted: boolean
  veiled: boolean
}

export interface ClipPageHandlers {
  attach: (video: HTMLVideoElement) => () => void
  onPlaying: (playing: boolean) => void
  onSoundBlocked: () => void
  onTogglePause: () => void
  onHold: (held: boolean) => void
  onQuickReact: (snacc: PlayableClip) => string | null
  onReveal: (snacc: PlayableClip) => void
  onReact?: (snacc: PlayableClip, emoji: string) => void
  onComment: (snacc: PlayableClip) => void
  onResnacc?: (snacc: PlayableClip) => void
  onShare: (snacc: PlayableClip) => void
  onMore: (snacc: PlayableClip) => void
}
