"use client"

import type { TextDraft as Draft } from "../hooks/use-text-draft"
import { LINE_HEIGHT, TEXT_PAD } from "../types"
import { editorFont, measureLine } from "../utils/font"
import type { Size } from "../utils/geometry"
import { layoutText } from "../utils/text"

type TextDraftProps = {
  draft: Draft
  color: string
  bounds: Size
  drag: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
  }
  onWrite: (text: string) => void
  onSettle: () => void
}

export function TextDraft({
  draft,
  color,
  bounds,
  drag,
  onWrite,
  onSettle,
}: TextDraftProps) {
  const style: React.CSSProperties = {
    color,
    font: editorFont(draft.size),
    lineHeight: `${draft.size * LINE_HEIGHT}px`,
    textShadow: "1px 1.5px 0 rgba(0,0,0,0.45)",
  }

  if (draft.editing) {
    return (
      <div
        className="absolute"
        style={{
          left: TEXT_PAD,
          top: draft.y - draft.size,
          width: bounds.width - TEXT_PAD * 2,
        }}
      >
        <textarea
          value={draft.text}
          onChange={(event) => onWrite(event.target.value)}
          onBlur={onSettle}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              onSettle()
            }
          }}
          autoFocus
          rows={1}
          placeholder="Say something"
          className="field-sizing-content w-full resize-none bg-transparent text-center outline-none placeholder:text-white/50"
          style={style}
        />
      </div>
    )
  }

  // Laid out through the same maths the canvas uses, so committing moves nothing.
  const { lines, placed } = layoutText(draft, bounds, measureLine)

  return (
    <div
      className="absolute inset-0 cursor-move touch-none select-none"
      {...drag}
    >
      {lines.map((line, index) => (
        <span
          key={index}
          className="absolute whitespace-pre"
          style={{
            ...style,
            left: placed[index].x,
            top: placed[index].y - draft.size,
          }}
        >
          {line}
        </span>
      ))}
    </div>
  )
}
