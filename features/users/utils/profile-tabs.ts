import {
  ImageIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  RepeatIcon,
} from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { ProfileTab } from "../types"

export const PROFILE_TABS: PillTab<ProfileTab>[] = [
  { value: "snaccs", label: "Snaccs", icon: MessageSquareIcon },
  { value: "replies", label: "Replies", icon: MessageCircleIcon },
  { value: "media", label: "Media", icon: ImageIcon },
  { value: "resnaccs", label: "Resnaccs", icon: RepeatIcon },
]

export const DEFAULT_PROFILE_TAB: ProfileTab = "snaccs"
