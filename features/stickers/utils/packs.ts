import {
  CopyIcon,
  FlagIcon,
  ImageUpIcon,
  PencilIcon,
  SearchIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react"
import { handleOf, nameOf } from "@/features/users/utils/names"
import { countLabel } from "@/lib/format"
import type {
  MakeMenuId,
  PackMenuId,
  Sticker,
  StickerMenuItem,
  StickerPack,
  StickerState,
} from "../types"

export const PACK_TITLE_MAX = 60

export function stickerState(
  sticker: Pick<Sticker, "premium" | "held">,
  premium: boolean
): StickerState {
  if (sticker.held) return "held"
  return sticker.premium && !premium ? "locked" : "ready"
}

export function packByline(
  pack: Pick<StickerPack, "kind" | "owner">
): string | null {
  if (pack.kind === "favourites") return null
  if (!pack.owner) return "by Snacc"
  return `by ${handleOf(pack.owner) ?? nameOf(pack.owner)}`
}

export function packDetails(
  pack: Pick<StickerPack, "kind" | "owner" | "stickers_count">
): string {
  return [packByline(pack), countLabel(pack.stickers_count, "sticker")]
    .filter(Boolean)
    .join(" · ")
}

export function coverUrlOf(pack: Pick<StickerPack, "cover">): string | null {
  return pack.cover ? (pack.cover.preview_url ?? pack.cover.url) : null
}

export function canAddTo(pack: Pick<StickerPack, "mine" | "status">): boolean {
  return pack.mine && pack.status === "published"
}

export function packTitleReady(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length > 0 && trimmed.length <= PACK_TITLE_MAX
}

const SHARE: StickerMenuItem<PackMenuId> = {
  id: "share",
  label: "Share pack",
  icon: Share2Icon,
}
const COPY: StickerMenuItem<PackMenuId> = {
  id: "copy",
  label: "Copy link",
  icon: CopyIcon,
}
const RENAME: StickerMenuItem<PackMenuId> = {
  id: "rename",
  label: "Rename",
  icon: PencilIcon,
}
const DELETE: StickerMenuItem<PackMenuId> = {
  id: "delete",
  label: "Delete pack",
  icon: Trash2Icon,
  destructive: true,
}
const REPORT: StickerMenuItem<PackMenuId> = {
  id: "report",
  label: "Report pack",
  icon: FlagIcon,
}

export function packMenu(
  pack: Pick<StickerPack, "kind" | "mine" | "status">,
  manage: boolean
): StickerMenuItem<PackMenuId>[] {
  if (pack.kind === "favourites") return []

  const shared = pack.status === "published" ? [SHARE, COPY] : []
  if (!pack.mine) return [...shared, REPORT]
  if (!manage) return shared

  return [...shared, RENAME, DELETE]
}

export const MAKE_MENU: StickerMenuItem<MakeMenuId>[] = [
  { id: "upload", label: "Upload an image", icon: ImageUpIcon },
  { id: "giphy", label: "From Giphy", icon: SearchIcon },
]
