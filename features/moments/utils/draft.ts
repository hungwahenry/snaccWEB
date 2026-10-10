import type { PickedImage } from "@/lib/media"
import type { MomentMode } from "../types"

interface MomentDraft {
  background: string
  image: PickedImage | null
  snaccId: string | null
}

export function momentContent(mode: MomentMode, draft: MomentDraft) {
  if (mode === "image") return { image: draft.image ?? undefined }
  if (mode === "snacc")
    return { background: draft.background, snaccId: draft.snaccId ?? undefined }
  return { background: draft.background }
}
