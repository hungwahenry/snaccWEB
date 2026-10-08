import type { ConversationPhoto } from "../../types"
import { PhotoTile } from "./photo-tile"

export function PhotoStrip({
  photos,
  onOpen,
}: {
  photos: ConversationPhoto[]
  onOpen: (index: number) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {photos.map((photo, index) => (
        <PhotoTile key={photo.id} photo={photo} index={index} onOpen={onOpen} />
      ))}
    </div>
  )
}
