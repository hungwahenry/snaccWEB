import {
  GlobeIcon,
  GraduationCapIcon,
  MessageSquareDashedIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import { realtimeRooms } from "@/providers/realtime-rooms"
import type { FeedScope, FeedScopesEnabled } from "../types"

export const DEFAULT_FEED_SCOPE: FeedScope = "global"

const CAMPUS: PillTab<FeedScope> = {
  value: "campus",
  label: "Campus",
  icon: GraduationCapIcon,
}
const FOLLOWING: PillTab<FeedScope> = {
  value: "following",
  label: "Following",
  icon: UsersRoundIcon,
}
const GLOBAL: PillTab<FeedScope> = {
  value: "global",
  label: "Global",
  icon: GlobeIcon,
}

export function feedTabs(enabled: FeedScopesEnabled): PillTab<FeedScope>[] {
  return [
    ...(enabled.global ? [GLOBAL] : []),
    CAMPUS,
    ...(enabled.following ? [FOLLOWING] : []),
  ]
}

export function scopeAllowed(
  scope: FeedScope,
  enabled: FeedScopesEnabled
): boolean {
  return scope === "campus" || enabled[scope]
}

export function resolveScope(
  picked: FeedScope,
  enabled: FeedScopesEnabled
): FeedScope {
  return scopeAllowed(picked, enabled) ? picked : "campus"
}

export function liveFeedRoom(
  scope: FeedScope,
  campusSlug: string | null
): string | null {
  if (scope === "global") return realtimeRooms.feedGlobal
  if (scope === "campus" && campusSlug)
    return realtimeRooms.feedCampus(campusSlug)
  return null
}

export const FEED_EMPTY: Record<
  FeedScope,
  { icon: LucideIcon; title: string; description: string }
> = {
  campus: {
    icon: MessageSquareDashedIcon,
    title: "No snaccs yet",
    description: "Nothing has been posted on your campus. Be the first.",
  },
  global: {
    icon: MessageSquareDashedIcon,
    title: "Nothing going on",
    description: "No campus has posted anything worth passing on yet.",
  },
  following: {
    icon: UsersRoundIcon,
    title: "You follow nobody yet",
    description: "Follow a few people and their best snaccs land here.",
  },
}

export const FEED_FAILED: Record<FeedScope, string> = {
  campus: "Could not load your campus",
  global: "Could not load the global feed",
  following: "Could not load the people you follow",
}
