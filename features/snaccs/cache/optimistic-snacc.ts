import type {
  CreateSnaccInput,
  PollPayload,
  Snacc,
  SnaccAuthor,
  SnaccDraft,
  SnaccPoll,
  SnaccReplyTo,
} from "../types"
import { liveMatchCard } from "@/features/football/utils/card"
import { toEmbedded } from "../utils/resnaccs"
import { findSnacc } from "."

export function draftToInput(id: string, draft: SnaccDraft): CreateSnaccInput {
  return {
    id,
    body: draft.body ?? undefined,
    images: draft.images.length > 0 ? draft.images : undefined,
    giphyId: draft.gif?.id,
    stickerId: draft.sticker?.id,
    matchId: draft.matchId,
    voice: draft.voice ?? undefined,
    parentId: draft.parentId,
    resnaccOfId: draft.resnaccOfId,
    poll: draft.poll,
    spoiler: draft.spoiler,
  }
}

/** Where a reply lands: a reply to a reply joins its thread, addressed to whoever wrote it. */
function placeReply(targetId: string): {
  parent_id: string
  reply_to_user: SnaccReplyTo | null
} {
  const target = findSnacc(targetId)
  if (!target || target.parent_id === null)
    return { parent_id: targetId, reply_to_user: null }

  return {
    parent_id: target.reply_to_user === null ? target.id : target.parent_id,
    reply_to_user: target.anonymous
      ? { id: "", username: null, anonymous: true }
      : {
          id: target.author.id,
          username: target.author.username,
          anonymous: false,
        },
  }
}

export function buildOptimisticSnacc(
  id: string,
  draft: SnaccDraft,
  author: SnaccAuthor
): Snacc {
  const original = draft.resnaccOfId ? findSnacc(draft.resnaccOfId) : undefined
  const placed = draft.parentId ? placeReply(draft.parentId) : null

  return {
    id,
    status: "sending",
    parent_id: placed?.parent_id ?? null,
    reply_to_user: placed?.reply_to_user ?? null,
    resnacc_of: original ? toEmbedded(original) : null,
    // Shown straight away from the board we already have; the server takes its own copy.
    match: draft.match ? liveMatchCard(draft.match) : null,
    my_resnacc: false,
    mine: true,
    body: draft.body,
    anonymous: draft.anonymous,
    spoiler: draft.spoiler,
    expires_at: null,
    created_at: new Date().toISOString(),
    edited_at: null,
    author,
    entities: [],
    voice: draft.voice
      ? {
          id: draft.voice.uri,
          url: draft.voice.uri,
          duration_ms: draft.voice.durationMs,
        }
      : null,
    poll: draft.poll ? optimisticPoll(id, draft.poll) : null,
    images: draft.images.map((image, position) => ({
      id: image.uri,
      url: image.uri,
      thumb_url: image.uri,
      width: image.width,
      height: image.height,
      position,
    })),
    gif: draft.gif
      ? {
          giphy_id: draft.gif.id,
          url: draft.gif.url,
          preview_url: draft.gif.preview_url,
          width: draft.gif.width,
          height: draft.gif.height,
        }
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
    reactions: [],
    reactions_count: 0,
    my_reaction: null,
    saved: false,
    pinned: false,
    held: false,
    quoted_gone: null,
    comments_count: 0,
    resnaccs_count: 0,
    views_count: 0,
  }
}

function optimisticPoll(snaccId: string, poll: PollPayload): SnaccPoll {
  return {
    id: snaccId,
    closes_at: new Date(
      Date.now() + poll.durationMinutes * 60_000
    ).toISOString(),
    closed: false,
    total_votes: null,
    my_option_id: null,
    options: poll.options.map((label, index) => {
      const image = poll.images?.[index]
      return {
        id: `${snaccId}-${index}`,
        label,
        votes_count: null,
        image: image
          ? {
              url: image.uri,
              thumb_url: image.uri,
              width: image.width,
              height: image.height,
            }
          : null,
      }
    }),
  }
}
