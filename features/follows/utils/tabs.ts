import { UserRoundCheckIcon, UsersRoundIcon } from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { FollowTab } from "../types"

export const FOLLOW_TABS: PillTab<FollowTab>[] = [
  { value: "followers", label: "Followers", icon: UsersRoundIcon },
  { value: "following", label: "Following", icon: UserRoundCheckIcon },
]
