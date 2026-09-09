import { MatchdaySkeleton } from "@/features/football/components/matchday-skeleton"
import { FollowSuggestionsSkeleton } from "@/features/follows/components/follow-suggestions"
import { TrendingTagsSkeleton } from "@/features/search/components/trending-tags"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <div className="flex flex-col gap-6 px-4 py-4 [--gutter:16px]">
        <MatchdaySkeleton />
        <FollowSuggestionsSkeleton />
        <TrendingTagsSkeleton />
      </div>
    </>
  )
}
