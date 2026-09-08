import { LINE_HEIGHT, TEXT_PAD } from "../types"
import { clamp, type Box, type Size } from "./geometry"

export type Measure = (line: string, size: number) => number

interface TextContent {
  text: string
  x: number
  y: number
  size: number
}

interface TextLayout {
  lines: string[]
  placed: { x: number; y: number }[]
  box: Box
}

function breakLong(
  word: string,
  maxWidth: number,
  widthOf: (line: string) => number
): string[] {
  if (widthOf(word) <= maxWidth) return [word]

  const pieces: string[] = []
  let piece = ""

  for (const character of word) {
    if (piece && widthOf(piece + character) > maxWidth) {
      pieces.push(piece)
      piece = character
    } else {
      piece += character
    }
  }

  return piece ? [...pieces, piece] : pieces
}

function wrap(
  text: string,
  maxWidth: number,
  widthOf: (line: string) => number
): string[] {
  const lines: string[] = []

  for (const paragraph of text.split("\n")) {
    let line = ""

    for (const word of paragraph.split(" ")) {
      for (const piece of breakLong(word, maxWidth, widthOf)) {
        const candidate = line ? `${line} ${piece}` : piece

        if (line && widthOf(candidate) > maxWidth) {
          lines.push(line)
          line = piece
        } else {
          line = candidate
        }
      }
    }

    lines.push(line)
  }

  return lines
}

export function layoutText(
  content: TextContent,
  bounds: Size,
  measure: Measure
): TextLayout {
  const widthOf = (line: string) => measure(line, content.size)
  const lineHeight = content.size * LINE_HEIGHT

  const lines = wrap(content.text, bounds.width - TEXT_PAD * 2, widthOf)
  const widths = lines.map(widthOf)
  const blockHeight = lines.length * lineHeight

  const firstBaseline = clamp(
    content.y,
    TEXT_PAD + lineHeight,
    Math.max(
      TEXT_PAD + lineHeight,
      bounds.height - blockHeight + lineHeight - TEXT_PAD
    )
  )

  const placed = widths.map((width, index) => ({
    x: clamp(
      content.x - width / 2,
      TEXT_PAD,
      Math.max(TEXT_PAD, bounds.width - width - TEXT_PAD)
    ),
    y: firstBaseline + index * lineHeight,
  }))

  return {
    lines,
    placed,
    box: {
      x: Math.min(...placed.map((line) => line.x)),
      y: firstBaseline - lineHeight,
      width: Math.max(...widths, 0),
      height: blockHeight,
    },
  }
}
