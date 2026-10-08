import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import { booleanFilter } from "@/features/admin/shell/utils/list-params"
import { userHandle } from "@/features/admin/shell/utils/user"
import { formatDate } from "@/lib/format"
import type {
  AdminStickerPack,
  PackAbilities,
  PackFilters,
  PackListed,
  PackListQuery,
  PackOwner,
  PackSticker,
  PackStickerGroups,
  StickerPackStatus,
  TitleDraft,
  UpdatePackInput,
  UploadProgress,
} from "../types"

export const TITLE_MAX = 60

export const STICKER_FILE_TYPES = "image/*"

export function pngName(fileName: string): string {
  return `${fileName.replace(/\.[^./]+$/, "") || "sticker"}.png`
}

export const OWNER_FILTERS = [
  "snacc",
  "people",
] as const satisfies readonly PackOwner[]

export const OWNER_OPTIONS: Option<PackOwner>[] = [
  { value: "snacc", label: "Snacc's" },
  { value: "people", label: "People's" },
]

export const STATUS_FILTERS = [
  "draft",
  "published",
  "taken_down",
] as const satisfies readonly StickerPackStatus[]

export const PACK_STATUS: Record<StickerPackStatus, StatusMeta> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  taken_down: { label: "Taken down", variant: "destructive" },
}

export const STATUS_OPTIONS: Option<StickerPackStatus>[] = STATUS_FILTERS.map(
  (status) => ({ value: status, label: PACK_STATUS[status].label })
)

export const LISTED_FILTERS = [
  "true",
  "false",
] as const satisfies readonly PackListed[]

export const LISTED_OPTIONS: Option<PackListed>[] = [
  { value: "true", label: "In the catalog" },
  { value: "false", label: "Not in the catalog" },
]

export function packListQuery(
  filters: PackFilters,
  perPage: number
): PackListQuery {
  return {
    page: filters.page,
    perPage,
    q: filters.q.trim() || undefined,
    owner: filters.owner ?? undefined,
    status: filters.status ?? undefined,
    listed: booleanFilter(filters.listed, "true"),
  }
}

const PREMIUM: StatusMeta = { label: "Premium", variant: "secondary" }
const IN_EVERY_TRAY: StatusMeta = { label: "In every tray", variant: "outline" }
const FEATURED: StatusMeta = { label: "Featured", variant: "outline" }

export function packBadges(
  pack: Pick<
    AdminStickerPack,
    "status" | "premium" | "added_by_default" | "listed_at" | "owner"
  >
): StatusMeta[] {
  return [
    PACK_STATUS[pack.status],
    ...(pack.premium ? [PREMIUM] : []),
    ...(pack.added_by_default ? [IN_EVERY_TRAY] : []),
    ...(isFeatured(pack) ? [FEATURED] : []),
  ]
}

export function ownerLabel(pack: Pick<AdminStickerPack, "owner">): string {
  return pack.owner ? userHandle(pack.owner) : "Snacc"
}

export function packAbilities(
  pack: Pick<
    AdminStickerPack,
    "owner" | "status" | "published_at" | "stickers_count"
  >
): PackAbilities {
  const snacc = pack.owner === null
  const published = pack.status === "published"

  return {
    curate: snacc && pack.status !== "taken_down",
    publish: snacc && pack.status === "draft",
    publishReady: pack.stickers_count > 0,
    unpublish: snacc && published,
    addToTrays: snacc && published,
    remove: snacc && pack.published_at === null,
    feature: !snacc && published,
    takeDown: !snacc && pack.status !== "taken_down",
  }
}

export function catalogNote(
  pack: Pick<AdminStickerPack, "status" | "published_at" | "stickers_count">
): string {
  if (pack.status === "published") {
    return "In the catalog. Anyone can add it to their tray."
  }
  if (pack.stickers_count === 0) {
    return "A draft only admins can see. Add stickers, then publish it."
  }

  return pack.published_at
    ? "Back to a draft: out of the catalog and out of people's trays until you publish it again."
    : "A draft only admins can see. Publishing puts it in the catalog."
}

export function traysNote(
  pack: Pick<AdminStickerPack, "status" | "added_by_default">
): string {
  if (pack.added_by_default) {
    return "In everyone's tray, and added for everyone who joins."
  }

  return pack.status === "published"
    ? "Puts it in everyone's tray, and in the tray of everyone who joins later."
    : "Publish the pack first."
}

export function deleteNote(
  pack: Pick<AdminStickerPack, "status" | "published_at">
): string {
  if (pack.published_at === null) {
    return "It never went out, so it can go for good, stickers and all."
  }

  return pack.status === "published"
    ? "It has gone out, so it can't be deleted: people may have saved it or sent its stickers. Unpublish it instead to take it out of the catalog and people's trays."
    : "It has gone out, so it can't be deleted: people may have saved it or sent its stickers. As a draft, nobody can find it or send from it."
}

export function featureNote(pack: Pick<AdminStickerPack, "status">): string {
  switch (pack.status) {
    case "published":
      return "Shows it in the catalog next to Snacc's packs."
    case "taken_down":
      return "A pack that was taken down can't be featured."
    default:
      return "Only a published pack can be featured."
  }
}

export function takeDownNote(pack: Pick<AdminStickerPack, "status">): string {
  return pack.status === "taken_down"
    ? "Taken down. The pack and every sticker sent from it are hidden everywhere."
    : "Hides the pack and every sticker anyone has sent from it. There's no undo."
}

export function splitStickers(stickers: PackSticker[]): PackStickerGroups {
  return {
    live: stickers.filter((sticker) => sticker.removed_at === null),
    removed: stickers.filter((sticker) => sticker.removed_at !== null),
  }
}

export function stickersSummary({ live, removed }: PackStickerGroups): string {
  const held = live.filter((sticker) => sticker.held_at !== null).length

  return [
    plural(live.length, "sticker"),
    held > 0 ? `${held} held` : null,
    removed.length > 0 ? `${removed.length} removed` : null,
  ]
    .filter(Boolean)
    .join(" · ")
}

const REMOVED: StatusMeta = { label: "Removed", variant: "destructive" }
const HELD: StatusMeta = { label: "Held", variant: "secondary" }

export function stickerBadges(
  sticker: Pick<PackSticker, "held_at" | "removed_at">
): StatusMeta[] {
  if (sticker.removed_at) return [REMOVED]

  return sticker.held_at ? [HELD] : []
}

export function stickerNote(
  sticker: Pick<PackSticker, "held_at" | "removed_at">
): string | null {
  if (sticker.removed_at) return `Removed ${formatDate(sticker.removed_at)}`

  return sticker.held_at ? `Held ${formatDate(sticker.held_at)}` : null
}

export function isFeatured(
  pack: Pick<AdminStickerPack, "owner" | "listed_at">
): boolean {
  return pack.owner !== null && pack.listed_at !== null
}

export function stickerSrc(
  sticker: Pick<PackSticker, "url" | "removed_at">
): string | null {
  return sticker.removed_at ? null : sticker.url
}

export function toTitle(draft: TitleDraft): string | null {
  const title = draft.title.trim()

  return title.length > 0 && title.length <= TITLE_MAX ? title : null
}

export function packSavedMessage(input: UpdatePackInput): string {
  if (input.premium === undefined) return "Pack renamed."

  return input.premium
    ? "Only Premium subscribers can send from it now."
    : "Anyone can send from it now."
}

export function addedMessage(added: number, total: number): string {
  return added === total
    ? `${plural(added, "sticker")} added.`
    : `${added} of ${plural(total, "sticker")} added.`
}

export function failedMessage(
  failures: readonly { name: string; message: string }[]
): string | null {
  const [first] = failures
  if (!first) return null

  return failures.length === 1
    ? `“${first.name}” wasn't added. ${first.message}`
    : `${failures.length} images weren't added. “${first.name}”: ${first.message}`
}

export function progressLabel({ done, total }: UploadProgress): string {
  return `Adding ${Math.min(done + 1, total)} of ${total}…`
}

export function progressValue({ done, total }: UploadProgress): number {
  return total === 0 ? 0 : Math.round((done / total) * 100)
}
