import { matchLine } from "@/features/football/utils/card"
import { nameOf } from "@/features/users/utils/names"
import { clock } from "@/features/voice/utils/clock"
import { countLabel } from "@/lib/format"
import type { EmbeddedSnacc, GlimpsedSnacc, SnaccAuthor } from "../types"

export const GLIMPSE_THUMBS = 4

export type GlimpseChipKind = "poll" | "match" | "quote" | "sensitive"

export interface GlimpseChip {
  kind: GlimpseChipKind
  label: string
}

/** What a snacc in brief shows: its words, and a taste of each thing it carries. */
export interface Glimpse {
  body: string | null
  voice: EmbeddedSnacc["voice"]
  thumbs: { urls: string[]; extra: number } | null
  gif: { url: string; width: number; height: number } | null
  sticker: EmbeddedSnacc["sticker"]
  chips: GlimpseChip[]
}

/** The name a byline shows: the handle people know, else whatever name there is. */
export function bylineName(
  author: Pick<SnaccAuthor, "username" | "display_name">
): string {
  return author.username || nameOf(author)
}

export function quotingLabel(
  quoted: Pick<EmbeddedSnacc, "anonymous" | "author">
): string {
  if (quoted.anonymous) return "Quoting Ghost"
  return quoted.author.username
    ? `Quoting @${quoted.author.username}`
    : "Quoting a snacc"
}

export function pollLabel(optionCount: number): string {
  return `Poll · ${countLabel(optionCount, "option")}`
}

export function voiceLabel(durationMs: number): string {
  return `Voice note · ${clock(durationMs)}`
}

function sensitiveLabel(snacc: Pick<EmbeddedSnacc, "images" | "gif">): string {
  if (snacc.gif) return "Sensitive GIF"
  return snacc.images.length === 1
    ? "Sensitive photo"
    : `Sensitive · ${countLabel(snacc.images.length, "photo")}`
}

export function glimpseOf(snacc: GlimpsedSnacc): Glimpse {
  const media = snacc.images.length > 0 || snacc.gif !== null
  const veiled = snacc.spoiler && media
  const shown = veiled ? [] : snacc.images.slice(0, GLIMPSE_THUMBS)

  const chips: GlimpseChip[] = []
  if (veiled) chips.push({ kind: "sensitive", label: sensitiveLabel(snacc) })
  if (snacc.poll)
    chips.push({ kind: "poll", label: pollLabel(snacc.poll.options.length) })
  if (snacc.match) chips.push({ kind: "match", label: matchLine(snacc.match) })
  if (snacc.resnacc_of)
    chips.push({ kind: "quote", label: quotingLabel(snacc.resnacc_of) })

  return {
    body: snacc.body?.trim() || null,
    voice: snacc.voice,
    thumbs:
      shown.length > 0
        ? {
            urls: shown.map((image) => image.thumb_url || image.url),
            extra: snacc.images.length - shown.length,
          }
        : null,
    gif:
      snacc.gif && !veiled
        ? {
            url: snacc.gif.preview_url ?? snacc.gif.url,
            width: snacc.gif.width,
            height: snacc.gif.height,
          }
        : null,
    sticker: snacc.sticker,
    chips,
  }
}

/** One line for something with no words of its own: "🎤 Voice note · 0:12", "📷 3 photos". */
export function attachmentSummary(parts: {
  poll: boolean
  voiceMs: number | null
  sticker: boolean
  gif: boolean
  images: number
}): string | null {
  if (parts.poll) return "📊 Poll"
  if (parts.voiceMs !== null) return `🎤 ${voiceLabel(parts.voiceMs)}`
  if (parts.sticker) return "✨ Sticker"
  if (parts.gif) return "🎞️ GIF"
  if (parts.images === 1) return "📷 Photo"
  if (parts.images > 1) return `📷 ${countLabel(parts.images, "photo")}`
  return null
}
