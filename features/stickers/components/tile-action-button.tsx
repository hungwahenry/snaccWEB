import { HeartIcon, XIcon } from "lucide-react"
import type { StickerTileAction } from "../types"

const ACTIONS = {
  keep: { icon: HeartIcon, label: "Keep in Favourites" },
  remove: { icon: XIcon, label: "Remove sticker" },
} as const

export function TileActionButton({
  action,
  onPress,
}: {
  action: StickerTileAction
  onPress: () => void
}) {
  const { icon: Icon, label } = ACTIONS[action]

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      title={label}
      className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity outline-none group-hover:opacity-100 hover:bg-background focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring [@media(pointer:coarse)]:hidden"
    >
      <Icon className="size-4" />
    </button>
  )
}
