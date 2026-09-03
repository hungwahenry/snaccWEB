import Link from "next/link"
import type { ReactNode } from "react"

// The same detectors the app uses for bios: web addresses with a lowercase ending so prose like
// "nice.Also" stays prose, and @mentions with the username rules.
const URL_PATTERN =
  /(?<=^|[\s(])(?:https?:\/\/)?(?:[A-Za-z0-9-]+\.)+[a-z]{2,24}(?:\/\S*)?/g
const MENTION_PATTERN = /(?<=^|\s)@([a-zA-Z][a-zA-Z0-9_]{2,29})(?![a-zA-Z0-9_])/gu

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
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-extrabold hover:underline"
        >
          {raw}
        </a>
      ),
    })
  }

  for (const match of text.matchAll(MENTION_PATTERN)) {
    spans.push({
      start: match.index,
      text: match[0],
      node: (
        <Link
          key={match.index}
          href={`/profile/${match[1]}`}
          className="font-extrabold hover:underline"
        >
          {match[0]}
        </Link>
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
