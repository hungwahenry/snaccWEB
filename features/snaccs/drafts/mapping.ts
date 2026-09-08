import { fromBlob, type PickedImage } from "@/lib/media"
import type { VoiceDraft } from "@/features/voice/hooks/use-voice-recorder"
import type { DraftSeed } from "../hooks/composer/use-snacc-draft"
import type { PollDraft } from "../hooks/composer/use-poll-draft"
import type { DraftImage } from "../utils/draft-images"
import type { StoredDraftImage, StoredPollDraft, StoredVoice } from "./types"
import type { StoredDraft } from "./types"

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
