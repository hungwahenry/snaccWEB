import type { StickerTile as Tile, TileActionId } from "../types"
import { StickerTile } from "./sticker-tile"

export function StickerGrid({
  tiles,
  onPick,
  onAction,
}: {
  tiles: Tile[]
  onPick?: (tile: Tile) => void
  onAction: (tile: Tile, action: TileActionId) => void
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5 px-4">
      {tiles.map((tile) => (
        <StickerTile
          key={tile.sticker.id}
          tile={tile}
          onPick={onPick}
          onAction={onAction}
        />
      ))}
    </div>
  )
}
