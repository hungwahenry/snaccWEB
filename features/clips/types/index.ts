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
  upload: ClipUpload
}
