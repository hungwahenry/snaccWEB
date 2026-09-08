import type { ReactionEmoji } from "../utils/emoji"

type ReactionGridProps = {
  emojis: ReactionEmoji[]
  columns: number
  cellSize: number
  emojiSize: number
  onSelect: (emoji: string) => void
}

export function ReactionGrid({
  emojis,
  columns,
  cellSize,
  emojiSize,
  onSelect,
}: ReactionGridProps) {
  return (
    <div
      className="grid content-start"
      style={{ gridTemplateColumns: `repeat(${columns}, ${cellSize}px)` }}
    >
      {emojis.map((item) => (
        <button
          key={item.emoji}
          type="button"
          onClick={() => onSelect(item.emoji)}
          aria-label={item.name || item.emoji}
          style={{ width: cellSize, height: cellSize, fontSize: emojiSize }}
          className="flex items-center justify-center rounded-xl leading-none transition-colors hover:bg-accent active:bg-accent"
        >
          {item.emoji}
        </button>
      ))}
    </div>
  )
}
