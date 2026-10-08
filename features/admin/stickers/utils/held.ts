import { stickerPackPath } from "@/features/admin/shell/routes"
import type { HeldSticker } from "../types"

export function heldPackHref(pack: HeldSticker["pack"]): string | null {
  return pack.kind === "pack" ? stickerPackPath(pack.id) : null
}

export function heldPackName(pack: HeldSticker["pack"]): string {
  return pack.kind === "favourites" ? "Favourites" : pack.title
}
