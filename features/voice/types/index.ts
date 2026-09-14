export interface VoiceNote {
  id: string
  url: string
  duration_ms: number
}

/** A take recorded in the browser, not yet uploaded. */
export interface VoiceDraft {
  uri: string
  file: Blob
  mimeType: string
  durationMs: number
}

export type PlaybackSpeed = 1 | 1.5 | 2

export type VoiceSourceKind = "snacc" | "conversation" | "chat"

export interface VoiceSource {
  kind: VoiceSourceKind
  id: string
  label: string
  avatarUrl: string | null
  authorId: string | null
}

export type VoicePlaybackStatus = "loading" | "playing" | "paused"

export interface VoicePlayback {
  note: VoiceNote
  source: VoiceSource | null
  status: VoicePlaybackStatus
  positionMs: number
  durationMs: number
}
