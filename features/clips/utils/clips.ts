import type { SnaccClip } from "@/features/snaccs/types"
import type { ClipDraft } from "../types"

const PROGRESS_STEPS = 20
const LENGTH_GRACE_MS = 500

export type ClipContentType = "video/mp4" | "video/quicktime"

export function clipContentType(mime: string): ClipContentType | null {
  return mime === "video/mp4" || mime === "video/quicktime" ? mime : null
}

export function clipProblem(
  clip: { type: string; sizeBytes: number; durationMs: number },
  limits: { maxSeconds: number; maxMb: number }
): string | null {
  if (!clipContentType(clip.type)) return "Pick an MP4 or MOV video."
  if (clip.durationMs > limits.maxSeconds * 1000 + LENGTH_GRACE_MS) {
    return `Clips can be up to ${limits.maxSeconds} seconds. Trim it and try again.`
  }
  if (clip.sizeBytes > limits.maxMb * 1024 * 1024) {
    return `That video is over ${limits.maxMb} MB. Pick a smaller one.`
  }
  return null
}

export function withLocalPoster(
  clip: SnaccClip | null,
  local: ClipDraft | null
): SnaccClip | null {
  if (!clip || !local?.posterUrl || clip.poster_url) return clip
  return { ...clip, poster_url: local.posterUrl }
}

export function clipStatusLabel(uploadProgress: number | undefined): string {
  return uploadProgress !== undefined && uploadProgress < 1
    ? `Uploading ${Math.round(uploadProgress * 100)}%`
    : "Processing…"
}

export function progressStep(fraction: number): number {
  return (
    Math.floor(Math.min(1, Math.max(0, fraction)) * PROGRESS_STEPS) /
    PROGRESS_STEPS
  )
}
