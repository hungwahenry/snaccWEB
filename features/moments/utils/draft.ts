import type { PickedImage } from "@/lib/media"
import type { MomentMode, MomentSharing } from "../types"

export type MomentContent =
  | { background: string }
  | { image: PickedImage }
  | { background: string; snaccId: string }

interface MomentDraft {
  hasWords: boolean
  background: string
  image: PickedImage | null
  sharing: MomentSharing | null
}

export function momentContent(
  mode: MomentMode,
  draft: MomentDraft
): MomentContent | null {
  if (mode === "image") return draft.image ? { image: draft.image } : null
  if (mode === "snacc") {
    return draft.sharing?.ready
      ? { background: draft.background, snaccId: draft.sharing.snaccId }
      : null
  }
  return draft.hasWords ? { background: draft.background } : null
}
