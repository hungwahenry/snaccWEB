import type { Option } from "@/features/admin/shell/types"

export const HELD_VALUES = ["true"] as const
export const DELETED_VALUES = ["false", "true"] as const

export const HELD_OPTIONS: Option<(typeof HELD_VALUES)[number]>[] = [
  { value: "true", label: "Held by a report" },
]

export const DELETED_OPTIONS: Option<(typeof DELETED_VALUES)[number]>[] = [
  { value: "false", label: "Live" },
  { value: "true", label: "Removed" },
]
