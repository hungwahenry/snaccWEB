import { CalendarHeartIcon, SchoolIcon } from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { HangoutScope } from "../types"

export const HANGOUT_TABS: PillTab<HangoutScope>[] = [
  { value: "campus", label: "On campus", icon: SchoolIcon },
  { value: "mine", label: "Yours", icon: CalendarHeartIcon },
]

export const HANGOUT_EMPTY: Record<
  HangoutScope,
  { title: string; description: string }
> = {
  campus: {
    title: "Nothing planned on campus",
    description:
      "Hangouts people on your campus plan show up here, soonest first.",
  },
  mine: {
    title: "No hangouts yet",
    description:
      "Hangouts you host, join or ask to join show up here until they are over.",
  },
}
