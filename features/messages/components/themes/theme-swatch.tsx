import type { ChatPaint } from "@/features/chat-themes/types"
import { ThemeThumbnail } from "./theme-thumbnail"

export interface ThemeSwatchProps {
  label: string
  paint: ChatPaint | null
  photoUrl: string | null
  needsPhoto: boolean
  selected: boolean
  locked: boolean
  onPress: () => void
}

export function ThemeSwatch({
  label,
  width,
  onPress,
  ...thumbnail
}: ThemeSwatchProps & { width: number }) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={thumbnail.selected}
      aria-label={thumbnail.locked ? `${label}, Premium` : label}
      className="flex flex-col items-center gap-1.5 rounded-2xl outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
      style={{ width }}
    >
      <ThemeThumbnail width={width} {...thumbnail} />
      <span className="max-w-full truncate text-xs text-foreground">
        {label}
      </span>
    </button>
  )
}
