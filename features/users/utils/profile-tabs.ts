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

export function profileTab(value: ProfileTab): PillTab<ProfileTab> {
  return PROFILE_TABS.find((tab) => tab.value === value) ?? PROFILE_TABS[0]
}

const EMPTY_TITLE: Record<ProfileTab, string> = {
  snaccs: "No snaccs yet",
  replies: "No replies yet",
  media: "No media yet",
  resnaccs: "No resnaccs yet",
}

const MINE: Record<ProfileTab, string> = {
  snaccs: "What you post shows up here.",
  replies: "Your replies to other snaccs show up here.",
  media: "Photos and GIFs you post show up here.",
  resnaccs: "Snaccs you resnacc show up here.",
}

const THEIRS: Record<ProfileTab, string> = {
  snaccs: "When they post, it shows up here.",
  replies: "When they reply to a snacc, it shows up here.",
  media: "When they post a photo or GIF, it shows up here.",
  resnaccs: "When they resnacc something, it shows up here.",
}

export function profileEmpty(
  tab: ProfileTab,
  isMe: boolean
): { title: string; description: string } {
  return {
    title: EMPTY_TITLE[tab],
    description: (isMe ? MINE : THEIRS)[tab],
  }
}
