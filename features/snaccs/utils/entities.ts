import { findShareLinks, mend } from "@/lib/share-links"
import type { ActiveToken, SnaccEntity } from "../types"

const HASHTAG_PATTERN = /(?<=^|\s)#([\p{L}\p{N}_]+)/gu
const MENTION_PATTERN =
  /(?<=^|\s)@([a-zA-Z][a-zA-Z0-9_]{2,29})(?![a-zA-Z0-9_])/gu
const HASHTAG_HAS_LETTER = /\p{L}/u
const TOKEN_CHARACTER = /[\p{L}\p{N}_]/u
const CASHTAG_PATTERN =
  /(?<=^|\s)\$(?=[0-9]*[a-zA-Z])([a-zA-Z0-9]{1,10})(?![a-zA-Z0-9])/gu
const CASHTAG_TERM = /^[a-zA-Z0-9]*$/
const MARKERS: Record<string, ActiveToken["kind"]> = {
  "#": "hashtag",
  "@": "mention",
  $: "cashtag",
}
const HASHTAG_MAX_LENGTH = 100

interface Span {
  start: number
  end: number
}

interface BodySegment {
  text: string
  entity: boolean
}

export interface RenderedSegment {
  text: string
  entity: SnaccEntity | null
}

function segmentsOf<S extends Span>(
  body: string,
  spans: S[]
): { text: string; span: S | null }[] {
  const segments: { text: string; span: S | null }[] = []
  let cursor = 0

  for (const span of spans) {
    if (span.start > cursor)
      segments.push({ text: body.slice(cursor, span.start), span: null })
    segments.push({ text: body.slice(span.start, span.end), span })
    cursor = span.end
  }
  if (cursor < body.length)
    segments.push({ text: body.slice(cursor), span: null })

  return segments
}

export function toRenderedSegments(
  body: string,
  entities: SnaccEntity[],
  stripLinks = false
): RenderedSegment[] {
  const spans: { entity: SnaccEntity | null; start: number; end: number }[] = [
    ...entities.map((entity) => ({
      entity,
      start: entity.start,
      end: entity.start + entity.length,
    })),
    ...(stripLinks ? findShareLinks(body) : []).map(({ start, length }) => ({
      entity: null,
      start,
      end: start + length,
    })),
  ].sort((a, b) => a.start - b.start)

  const kept: RenderedSegment[] = []
  let gap = false

  for (const { text, span } of segmentsOf(body, spans)) {
    if (span !== null && span.entity === null) {
      gap = true
      continue
    }

    const rendered = {
      text: span?.entity ? displayText(body, span.entity) : text,
      entity: span?.entity ?? null,
    }
    const prev = kept[kept.length - 1]

    if (gap && prev && !prev.entity && !rendered.entity) {
      kept[kept.length - 1] = {
        text: mend(prev.text, rendered.text),
        entity: null,
      }
    } else {
      kept.push(rendered)
    }
    gap = false
  }

  const first = kept[0]
  if (first && !first.entity)
    kept[0] = { ...first, text: first.text.replace(/^\s+/, "") }
  const last = kept[kept.length - 1]
  if (last && !last.entity)
    kept[kept.length - 1] = { ...last, text: last.text.replace(/\s+$/, "") }

  return kept.filter(
    (segment) => segment.entity !== null || segment.text.length > 0
  )
}

function displayText(body: string, entity: SnaccEntity): string {
  return entity.type === "mention"
    ? `@${entity.user.username ?? ""}`
    : body.slice(entity.start, entity.start + entity.length)
}

function hashtagMatches(body: string): (Span & { tag: string })[] {
  const found: (Span & { tag: string })[] = []

  for (const match of body.matchAll(HASHTAG_PATTERN)) {
    const tag = match[1]
    if (tag.length > HASHTAG_MAX_LENGTH || !HASHTAG_HAS_LETTER.test(tag))
      continue
    found.push({ tag, start: match.index, end: match.index + match[0].length })
  }

  return found
}

function cashtagMatches(body: string): (Span & { symbol: string })[] {
  return [...body.matchAll(CASHTAG_PATTERN)].map((match) => ({
    symbol: match[1].toUpperCase(),
    start: match.index,
    end: match.index + match[0].length,
  }))
}

export interface TagLimits {
  maxMentions: number
  maxHashtags: number
  maxCashtags: number
}

export function tagLimitProblem(
  body: string,
  limits: TagLimits
): string | null {
  const people = new Set(
    [...body.matchAll(MENTION_PATTERN)].map((match) => match[1].toLowerCase())
  )
  const hashtags = new Set(
    hashtagMatches(body).map(({ tag }) => tag.toLowerCase())
  )
  const coins = new Set(cashtagMatches(body).map(({ symbol }) => symbol))

  if (people.size > limits.maxMentions) {
    return `You can tag up to ${limits.maxMentions} people in one snacc.`
  }
  if (hashtags.size > limits.maxHashtags) {
    return `You can use up to ${limits.maxHashtags} hashtags in one snacc.`
  }
  if (coins.size > limits.maxCashtags) {
    return `You can tag up to ${limits.maxCashtags} coins in one snacc.`
  }
  return null
}

function entityRanges(body: string): Span[] {
  const ranges: Span[] = hashtagMatches(body).map(({ start, end }) => ({
    start,
    end,
  }))

  for (const { start, end } of cashtagMatches(body)) {
    ranges.push({ start, end })
  }
  for (const match of body.matchAll(MENTION_PATTERN)) {
    ranges.push({ start: match.index, end: match.index + match[0].length })
  }
  for (const { start, length } of findShareLinks(body)) {
    ranges.push({ start, end: start + length })
  }

  return ranges.sort((a, b) => a.start - b.start)
}

export function toSegments(body: string): BodySegment[] {
  return segmentsOf(body, entityRanges(body)).map(({ text, span }) => ({
    text,
    entity: span !== null,
  }))
}

export function activeToken(body: string, cursor: number): ActiveToken | null {
  let index = Math.min(cursor, body.length)
  while (index > 0 && TOKEN_CHARACTER.test(body[index - 1])) index -= 1

  const marker = body[index - 1]
  const kind = marker === undefined ? undefined : MARKERS[marker]
  if (!kind) return null

  const preceding = body[index - 2]
  if (preceding !== undefined && !/\s/.test(preceding)) return null

  const term = body.slice(index, cursor)
  if (kind === "cashtag" && !CASHTAG_TERM.test(term)) return null

  return { kind, term, start: index - 1, end: cursor }
}
