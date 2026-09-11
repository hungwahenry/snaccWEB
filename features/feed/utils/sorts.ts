import { ClockIcon, FlameIcon } from "lucide-react"
import type { FeedSort, FeedSortOption } from "../types"

export const DEFAULT_FEED_SORT: FeedSort = "top"

export const FEED_SORTS: FeedSortOption[] = [
  {
    value: "top",
    label: "Top",
    hint: "What people are reading",
    icon: FlameIcon,
  },
  {
    value: "latest",
    label: "Latest",
    hint: "Everything, newest first",
    icon: ClockIcon,
  },
]

/** A sort read back from storage, or null when it is missing or not one we know. */
export function feedSortOf(raw: string | null | undefined): FeedSort | null {
  return raw === "top" || raw === "latest" ? raw : null
}
