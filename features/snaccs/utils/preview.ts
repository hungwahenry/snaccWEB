import type { Snacc } from "../types"

type Previewable = Pick<Snacc, "body" | "voice" | "gif" | "sticker" | "images">

export function snaccPreview(snacc: Previewable): string {
  if (snacc.body) return snacc.body
  if (snacc.voice) return "🎤 Voice note"
  if (snacc.sticker) return "✨ Sticker"
  if (snacc.gif) return "🎞️ GIF"
  if (snacc.images.length > 1) return `📷 ${snacc.images.length} photos`
  if (snacc.images.length === 1) return "📷 Photo"
  return ""
}
