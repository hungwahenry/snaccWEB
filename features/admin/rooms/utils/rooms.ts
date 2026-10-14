import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { AdminRoom, AdminRoomMessage, RoomKind } from "../types"

export const ROOM_KINDS = [
  "country",
  "campus",
  "hangout",
] as const satisfies readonly RoomKind[]

export const KIND_LABELS: Record<RoomKind, string> = {
  country: "Country room",
  campus: "Campus room",
  hangout: "Hangout room",
}

export const KIND_OPTIONS: Option<RoomKind>[] = ROOM_KINDS.map((kind) => ({
  value: kind,
  label: KIND_LABELS[kind],
}))

export const LOCK_VALUES = ["true", "false"] as const

export const LOCK_OPTIONS: Option<(typeof LOCK_VALUES)[number]>[] = [
  { value: "true", label: "Locked" },
  { value: "false", label: "Open" },
]

export const HELD_VALUES = ["true"] as const

export const HELD_OPTIONS: Option<(typeof HELD_VALUES)[number]>[] = [
  { value: "true", label: "Held for review" },
]

export function roomPlace(
  room: Pick<AdminRoom, "kind" | "country_code" | "campus">,
  countryNames: ReadonlyMap<string, string>
): string {
  if (room.campus) {
    return room.campus.acronym
      ? `${room.campus.name} (${room.campus.acronym})`
      : room.campus.name
  }
  if (room.country_code) {
    return `Everyone at a campus in ${countryNames.get(room.country_code) ?? room.country_code}`
  }
  return KIND_LABELS[room.kind]
}

export function messageStates(
  message: Pick<AdminRoomMessage, "held_at" | "deleted_at" | "deleted_by">
): StatusMeta[] {
  return [
    message.held_at !== null && message.deleted_at === null
      ? { label: "Held", variant: "outline" as const }
      : null,
    message.deleted_at === null
      ? null
      : {
          label:
            message.deleted_by === "sender" ? "Withdrawn by sender" : "Removed",
          variant: "destructive" as const,
        },
  ].filter((state) => state !== null)
}
