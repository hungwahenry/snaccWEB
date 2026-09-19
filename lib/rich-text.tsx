import type { ReactNode } from "react"
import { RichLink } from "@/components/ui/rich-link"
import { profilePath } from "@/features/users/routes"

const URL_PATTERN =
  /(?<=^|[\s(])(?:https?:\/\/)?(?:[A-Za-z0-9-]+\.)+[a-z]{2,24}(?:\/\S*)?/g
const MENTION_PATTERN =
  /(?<=^|\s)@([a-zA-Z][a-zA-Z0-9_]{2,29})(?![a-zA-Z0-9_])/gu

interface Span {
  start: number
  text: string
  node: ReactNode
}

function spansOf(text: string): Span[] {
  const spans: Span[] = []

  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0].replace(/[.,;:!?)\]'"]+$/, "")
    if (!raw) continue
    const href = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
    spans.push({
      start: match.index,
      text: raw,
      node: (
        <RichLink key={match.index} href={href} external>
          {raw}
        </RichLink>
      ),
    })
  }

  for (const match of text.matchAll(MENTION_PATTERN)) {
    spans.push({
      start: match.index,
      text: match[0],
      node: (
        <RichLink key={match.index} href={profilePath(match[1])}>
          {match[0]}
        </RichLink>
      ),
    })
  }

  return spans.sort((a, b) => a.start - b.start)
}

export function richText(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let cursor = 0

  for (const span of spansOf(text)) {
    if (span.start < cursor) continue
    if (span.start > cursor) parts.push(text.slice(cursor, span.start))
    parts.push(span.node)
    cursor = span.start + span.text.length
  }

  if (cursor < text.length) parts.push(text.slice(cursor))

  return parts
}
