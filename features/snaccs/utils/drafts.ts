import type { VoiceDraft } from "@/features/voice/types"
import { timeAgo } from "@/lib/format"
import { fromBlob, type PickedImage } from "@/lib/media"
import type {
  DraftImage,
  DraftSeed,
  DraftThumb,
  PollDraft,
  StoredDraft,
  StoredDraftImage,
  StoredPollDraft,
  StoredVoice,
} from "../types"
import { attachmentSummary } from "./preview"

export const MAX_DRAFTS = 20

export function toStoredImage(asset: PickedImage): StoredDraftImage {
  return {
    blob: asset.file,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
    fileName: asset.fileName,
  }
}

function toPicked(image: StoredDraftImage): PickedImage {
  return fromBlob(image.blob, image, image.fileName)
}

export function toStoredVoice(voice: VoiceDraft): StoredVoice {
  return {
    blob: voice.file,
    mimeType: voice.mimeType,
    durationMs: voice.durationMs,
  }
}

function toVoiceDraft(voice: StoredVoice): VoiceDraft {
  return {
    file: voice.blob,
    uri: URL.createObjectURL(voice.blob),
    mimeType: voice.mimeType,
    durationMs: voice.durationMs,
  }
}

export function toStoredPoll(poll: PollDraft): StoredPollDraft {
  return {
    ...poll,
    options: poll.options.map((option) => ({
      text: option.text,
      image: option.image ? toStoredImage(option.image) : null,
    })),
  }
}

export function toDraftSeed(draft: StoredDraft): DraftSeed {
  return {
    body: draft.body,
    images: draft.images.map((image): DraftImage => ({
      kind: "picked",
      asset: toPicked(image),
    })),
    gif: draft.gif,
    spoiler: draft.spoiler,
    sticker: draft.sticker,
    voice: draft.voice ? toVoiceDraft(draft.voice) : null,
    poll: draft.poll
      ? {
          ...draft.poll,
          options: draft.poll.options.map((option) => ({
            text: option.text,
            image: option.image ? toPicked(option.image) : null,
          })),
        }
      : null,
  }
}

/** The newest first, the one it replaces gone, and never more than the cap. */
export function withSavedDraft(
  drafts: StoredDraft[],
  draft: StoredDraft,
  replacesId?: string
): StoredDraft[] {
  return [
    draft,
    ...drafts.filter(
      (entry) => entry.id !== replacesId && entry.id !== draft.id
    ),
  ].slice(0, MAX_DRAFTS)
}

export function withoutDraft(drafts: StoredDraft[], id: string): StoredDraft[] {
  return drafts.filter((entry) => entry.id !== id)
}

export function draftPreview(draft: StoredDraft): string {
  return (
    draft.body.trim() ||
    attachmentSummary({
      poll: draft.poll !== null,
      voiceMs: draft.voice?.durationMs ?? null,
      sticker: draft.sticker !== null,
      gif: draft.gif !== null,
      images: draft.images.length,
    }) ||
    "Empty draft"
  )
}

export function draftThumb(draft: StoredDraft): DraftThumb {
  if (draft.images[0]) return { blob: draft.images[0].blob }
  if (draft.gif) return { url: draft.gif.preview_url ?? draft.gif.url }
  if (draft.sticker)
    return { url: draft.sticker.preview_url ?? draft.sticker.url }
  const pollImage = draft.poll?.options.find((option) => option.image)?.image
  if (pollImage) return { blob: pollImage.blob }

  return null
}

/** "Reply · 2h", "Quote · 5m", or just when it was saved. */
export function draftMeta(draft: StoredDraft): string {
  const saved = timeAgo(draft.saved_at)
  if (draft.parentId) return `Reply · ${saved}`
  if (draft.resnaccOfId) return `Quote · ${saved}`
  return saved
}
