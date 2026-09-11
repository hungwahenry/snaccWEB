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
