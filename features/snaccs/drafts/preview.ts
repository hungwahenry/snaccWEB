import type { StoredDraft } from "./types"

export function draftPreview(draft: StoredDraft): string {
  const body = draft.body.trim()
  if (body) return body
  if (draft.poll) return "📊 Poll"
  if (draft.voice) return "🎤 Voice note"
  if (draft.sticker) return "✨ Sticker"
  if (draft.gif) return "🎞️ GIF"
  if (draft.images.length > 1) return `📷 ${draft.images.length} photos`
  if (draft.images.length === 1) return "📷 Photo"

  return "Empty draft"
}

/// A remote URL when the draft has one, or the blob that needs an object URL made for it.
export function draftThumb(
  draft: StoredDraft
): { url: string } | { blob: Blob } | null {
  if (draft.images[0]) return { blob: draft.images[0].blob }
  if (draft.gif) return { url: draft.gif.preview_url ?? draft.gif.url }
  if (draft.sticker)
    return { url: draft.sticker.preview_url ?? draft.sticker.url }
  const pollImage = draft.poll?.options.find((option) => option.image)?.image
  if (pollImage) return { blob: pollImage.blob }

  return null
}

export function draftContextLabel(draft: StoredDraft): string | null {
  if (draft.parentId) return "Reply"
  if (draft.resnaccOfId) return "Quote"

  return null
}
