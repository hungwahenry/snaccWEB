import type { LiveMatch } from "@/features/football/types"
import type { Gif } from "@/features/giphy/types"
import type { DraftSticker } from "@/features/stickers/types"
import type { VoiceDraft } from "@/features/voice/hooks/use-voice-recorder"
import type { User } from "@/features/users/types"
import type { PickedImage } from "@/lib/media"
import type { CreateSnaccInput } from "../api"
import type { Snacc, SnaccAuthor, SnaccPoll, SnaccReplyTo } from "../types"
import { toEmbedded } from "../utils/resnaccs"
import { findSnacc } from "."

export interface SnaccDraft {
  body: string | null
  images: PickedImage[]
  gif: Gif | null
  sticker: DraftSticker | null
  match: LiveMatch | null
  voice: VoiceDraft | null
  parentId?: string
  resnaccOfId?: string
  poll?: { options: string[]; images?: PickedImage[]; durationMinutes: number }
  spoiler: boolean
  anonymous: boolean
}

export function toOptimisticAuthor(me: User): SnaccAuthor {
  const profile = me.profile

  return {
    id: me.id,
    username: profile?.username ?? null,
    display_name: profile?.display_name ?? null,
    avatar_url: profile?.avatar_url ?? "",
    university: profile?.university
      ? {
          id: profile.university.id,
          name: profile.university.name,
          acronym: profile.university.acronym,
          slug: profile.university.slug,
        }
      : null,
    score: { tier: null, og: false },
    official: profile?.official ?? false,
    is_birthday: profile?.is_birthday ?? false,
  }
}

export function draftToInput(id: string, draft: SnaccDraft): CreateSnaccInput {
  return {
    id,
    body: draft.body ?? undefined,
    images: draft.images.length > 0 ? draft.images : undefined,
    giphyId: draft.gif?.id,
    stickerId: draft.sticker?.id,
    matchId: draft.match?.id,
    voice: draft.voice ?? undefined,
    parentId: draft.parentId,
    resnaccOfId: draft.resnaccOfId,
    poll: draft.poll,
    spoiler: draft.spoiler,
  }
}

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
    match: draft.match
      ? {
          match_id: draft.match.id,
          competition: draft.match.competition.name,
          home: { name: draft.match.home.name, crest: draft.match.home.crest },
          away: { name: draft.match.away.name, crest: draft.match.away.crest },
          kickoff_at: draft.match.kickoff_at,
          home_score: draft.match.home_score,
          away_score: draft.match.away_score,
          status: draft.match.status,
          live: true,
        }
      : null,
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

function optimisticPoll(
  snaccId: string,
  poll: NonNullable<SnaccDraft["poll"]>
): SnaccPoll {
  return {
    id: snaccId,
    closes_at: new Date(
      Date.now() + poll.durationMinutes * 60_000
    ).toISOString(),
    closed: false,
    total_votes: null,
    my_option_id: null,
    options: poll.options.map((label, index) => ({
      id: `${snaccId}-${index}`,
      label,
      votes_count: null,
      image: poll.images?.[index]
        ? {
            url: poll.images[index].uri,
            thumb_url: poll.images[index].uri,
            width: poll.images[index].width,
            height: poll.images[index].height,
          }
        : null,
    })),
  }
}
