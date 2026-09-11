import {
  GraduationCapIcon,
  HashIcon,
  MessageSquareDashedIcon,
  MessageSquareIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { SearchTab } from "../types"

export const SEARCH_TABS = [
  "people",
  "snaccs",
  "tags",
  "campuses",
] as const satisfies readonly SearchTab[]

export const DEFAULT_SEARCH_TAB: SearchTab = "people"

/** What the search page keeps in its address, so going back lands on the same results. */
export const SEARCH_PARAMS = {
  q: parseAsString.withDefault(""),
  tab: parseAsStringLiteral(SEARCH_TABS).withDefault(DEFAULT_SEARCH_TAB),
}

export const SEARCH_DEBOUNCE_MS = 300

export const SEARCH_TAB_PILLS: PillTab<SearchTab>[] = [
  { value: "people", label: "People", icon: UsersRoundIcon },
  { value: "snaccs", label: "Snaccs", icon: MessageSquareIcon },
  { value: "tags", label: "Tags", icon: HashIcon },
  { value: "campuses", label: "Campuses", icon: GraduationCapIcon },
]

export const SEARCH_FAILED = "Search didn't go through"

export const SEARCH_EMPTY: Record<
  SearchTab,
  { icon: LucideIcon; title: string; description: string }
> = {
  people: {
    icon: UsersRoundIcon,
    title: "No people found",
    description: "Try a name or a username.",
  },
  snaccs: {
    icon: MessageSquareDashedIcon,
    title: "No snaccs found",
    description: "Try different words.",
  },
  tags: {
    icon: HashIcon,
    title: "No tags found",
    description: "Try another tag.",
  },
  campuses: {
    icon: GraduationCapIcon,
    title: "No campuses found",
    description: "Try the full name or the acronym.",
  },
}
