import type { Author } from "@/features/users/types"
import type { SendChatMessageInput } from "../api"
import type { ChatDraft, ChatMessage } from "../types"
import { toReplyPreview } from "../utils/rooms"

export function draftToInput(
  id: string,
  draft: ChatDraft
): SendChatMessageInput {
  return {
    id,
    body: draft.body ?? undefined,
    replyToId: draft.replyingTo?.id,
    images: draft.images.length > 0 ? draft.images : undefined,
    voice: draft.voice ?? undefined,
    stickerId: draft.sticker?.id,
    giphyId: draft.gif?.id,
  }
}

/** Your message as it will look, shown before the server answers and swapped for its copy after. */
export function buildOptimisticChatMessage(
  id: string,
  roomId: string,
  draft: ChatDraft,
  sender: Author
): ChatMessage {
  return {
    id,
    room_id: roomId,
    status: "sending",
    body: draft.body,
    created_at: new Date().toISOString(),
    edited: false,
    mine: true,
    deleted: false,
    deleted_by_sender: false,
    held: false,
    sender,
    images: draft.images.map((image, position) => ({
      id: image.uri,
      url: image.uri,
      thumb_url: image.uri,
      width: image.width,
      height: image.height,
      position,
    })),
    voice: draft.voice
      ? { id, url: draft.voice.uri, duration_ms: draft.voice.durationMs }
      : null,
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
    reactions: [],
    reply_to: draft.replyingTo ? toReplyPreview(draft.replyingTo) : null,
  }
}
