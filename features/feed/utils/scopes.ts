import {
  GlobeIcon,
  GraduationCapIcon,
  MessageSquareDashedIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import type { University } from "@/features/universities/types"
import { realtimeRooms } from "@/providers/realtime-rooms"
import type { FeedScope, FeedScopesEnabled } from "../types"

export const DEFAULT_FEED_SCOPE: FeedScope = "country"

export const FALLBACK_FEED_SCOPE: FeedScope = "campus"

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
const COUNTRY: PillTab<FeedScope> = {
  value: "country",
  label: "Global",
  icon: GlobeIcon,
}

export function feedTabs(enabled: FeedScopesEnabled): PillTab<FeedScope>[] {
  return [
    ...(enabled.country ? [COUNTRY] : []),
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
  return scopeAllowed(picked, enabled) ? picked : FALLBACK_FEED_SCOPE
}

export function liveFeedRoom(
  scope: FeedScope,
  campus: Pick<University, "slug" | "country_code"> | null
): string | null {
  if (!campus) return null
  if (scope === "country") return realtimeRooms.feedCountry(campus.country_code)
  if (scope === "campus") return realtimeRooms.feedCampus(campus.slug)
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
  country: {
    icon: MessageSquareDashedIcon,
    title: "Nothing going on",
    description:
      "No campus in your country has posted anything worth passing on yet.",
  },
  following: {
    icon: UsersRoundIcon,
    title: "You follow nobody yet",
    description: "Follow a few people and their best snaccs land here.",
  },
}

export const FEED_FAILED: Record<FeedScope, string> = {
  campus: "Could not load your campus",
  country: "Could not load the global feed",
  following: "Could not load the people you follow",
}
