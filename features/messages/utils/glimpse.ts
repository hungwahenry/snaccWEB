import type { StickerAttachment } from "@/features/stickers/types"
import type {
  AttachmentChip,
  GlimpseMedia,
  MessageGlimpse,
  MoneyKind,
  QuotedMoment,
  ReplyGlimpse,
  VoiceNote,
} from "../types"
import { moneyChip } from "./money"
import { SHARE_LABEL, splitShareLinks } from "./share"

const MAX_THUMBS = 3

/** Anything shaped like a message, from a DM or a room. */
export interface GlimpseSource {
  body: string | null
  removed: boolean
  mine: boolean
  images: {
    url: string | null
    thumb_url: string | null
    view_once?: boolean
  }[]
  voice: VoiceNote | null
  gif: { url: string; preview_url: string | null } | null
  sticker: StickerAttachment | null
  money: { kind: MoneyKind; amount: number } | null
  moment: QuotedMoment | null
}

/** Only what a quoted message carried, as the server sends it inside a reply. */
export interface ReplyFlags {
  body: string | null
  removed: boolean
  mine: boolean
  has_images: boolean
  has_sticker: boolean
  has_gif: boolean
  has_voice: boolean
  money: { kind: MoneyKind; amount: number } | null
}

function wordsOf(body: string | null): {
  text: string | null
  chip: AttachmentChip | null
} {
  if (!body) return { text: null, chip: null }
  const { words, link } = splitShareLinks(body)
  return {
    text: words,
    chip: link ? { kind: "link", label: SHARE_LABEL[link] } : null,
  }
}

function mediaOf(source: GlimpseSource): GlimpseMedia | null {
  if (source.voice) return { kind: "voice", note: source.voice }

  const urls = source.images
    .filter((image) => !image.view_once)
    .map((image) => image.thumb_url ?? image.url)
    .filter((url): url is string => url !== null)
  if (urls.length > 0) {
    return {
      kind: "photos",
      urls: urls.slice(0, MAX_THUMBS),
      extra: Math.max(0, urls.length - MAX_THUMBS),
    }
  }

  if (source.gif)
    return { kind: "gif", url: source.gif.preview_url ?? source.gif.url }
  if (source.sticker) return { kind: "sticker", sticker: source.sticker }
  return null
}

export function momentLabel(mine: boolean, gone: boolean): string {
  const label = mine ? "You replied to their moment" : "Replied to your moment"
  return gone ? `${label} · no longer available` : label
}

export function messageGlimpse(
  source: GlimpseSource,
  removedText: string
): MessageGlimpse {
  if (source.removed) {
    return {
      text: removedText,
      removed: true,
      media: null,
      chips: [],
      moment: null,
    }
  }

  const words = wordsOf(source.body)
  const chips: AttachmentChip[] = []
  const media = mediaOf(source)

  if (source.images.some((image) => image.view_once))
    chips.push({ kind: "view_once", label: "View-once photo" })
  if (media?.kind === "gif") chips.push({ kind: "gif", label: "GIF" })
  if (source.money) chips.push(moneyChip(source.money, source.mine))
  if (words.chip) chips.push(words.chip)
  if (source.moment) {
    const gone = source.moment.expired || source.moment.id === null
    chips.push({ kind: "moment", label: momentLabel(source.mine, gone) })
  }

  return {
    text: words.text,
    removed: false,
    media,
    chips,
    moment:
      source.moment && !source.moment.expired && source.moment.id !== null
        ? source.moment
        : null,
  }
}

export function replyGlimpse(
  reply: ReplyFlags,
  removedText: string
): ReplyGlimpse {
  if (reply.removed) return { text: removedText, removed: true, chips: [] }

  const words = wordsOf(reply.body)
  const chips: AttachmentChip[] = []

  if (reply.has_voice) chips.push({ kind: "voice", label: "Voice note" })
  if (reply.has_images) chips.push({ kind: "photo", label: "Photo" })
  if (reply.has_gif) chips.push({ kind: "gif", label: "GIF" })
  if (reply.has_sticker) chips.push({ kind: "sticker", label: "Sticker" })
  if (reply.money) chips.push(moneyChip(reply.money, reply.mine))
  if (words.chip) chips.push(words.chip)

  return { text: words.text, removed: false, chips }
}
