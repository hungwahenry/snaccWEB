import type { Gif } from "@/features/giphy/types"
import type { DraftSticker } from "@/features/stickers/types"
import type { VoiceDraft } from "@/features/voice/hooks/use-voice-recorder"
import type { PickedImage } from "@/lib/media"
import type { SendMessageInput } from "../api"
import type { Message } from "../types"
import { toReplyPreview } from "../utils/preview"

export interface MessageDraft {
  body: string | null
  images: PickedImage[]
  replyingTo: Message | null
  viewOnce?: boolean
  gif?: Gif | null
  sticker?: DraftSticker | null
  voice?: VoiceDraft | null
}

export function draftToInput(
  id: string,
  draft: MessageDraft
): SendMessageInput {
  return {
    id,
    body: draft.body ?? undefined,
    replyToId: draft.replyingTo?.id,
    images: draft.images.length > 0 ? draft.images : undefined,
    viewOnce: draft.viewOnce === true ? true : undefined,
    giphyId: draft.gif?.id,
    stickerId: draft.sticker?.id,
    voice: draft.voice ?? undefined,
  }
}

export function buildOptimisticMessage(
  id: string,
  draft: MessageDraft
): Message {
  return {
    id,
    status: "sending",
    body: draft.body,
    removed: false,
    money: null,
    moment: null,
    deleted_by_sender: false,
    edited: false,
    mine: true,
    created_at: new Date().toISOString(),
    reply_to: draft.replyingTo ? toReplyPreview(draft.replyingTo) : null,
    reactions: [],
    voice: draft.voice
      ? {
          id: draft.voice.uri,
          url: draft.voice.uri,
          duration_ms: draft.voice.durationMs,
        }
      : null,
    images: draft.images.map((image, position) => ({
      id: image.uri,
      url: image.uri,
      thumb_url: image.uri,
      width: image.width,
      height: image.height,
      position,
      view_once: draft.viewOnce === true,
      opened: false,
      available: true,
    })),
    sticker: draft.sticker
      ? {
          sticker_id: draft.sticker.id,
          url: draft.sticker.url,
          preview_url: draft.sticker.preview_url,
          width: draft.sticker.width,
          height: draft.sticker.height,
        }
      : null,
    gif: draft.gif
      ? {
          giphy_id: draft.gif.id,
          url: draft.gif.url,
          preview_url: draft.gif.preview_url,
          width: draft.gif.width,
          height: draft.gif.height,
        }
      : null,
  }
}
