import { SmilePlusIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { UserRow, UserRowSkeleton } from "@/features/users/components/user-row"
import type { SnaccReaction, SnaccReactor } from "../../../types"
import { ReactionPill } from "./reaction-pill"

export type ReactionBreakdownSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  filter: string | null
  tallies: SnaccReaction[]
  reactors: SnaccReactor[]
  loading: boolean
  loadingMore: boolean
  loadMore: () => void
  filterBy: (emoji: string | null) => void
}

export function ReactionBreakdownSheet({
  open,
  onOpenChange,
  total,
  filter,
  tallies,
  reactors,
  loading,
  loadingMore,
  loadMore,
  filterBy,
}: ReactionBreakdownSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Reactions" tall>
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 pb-2 [&::-webkit-scrollbar]:hidden">
        <ReactionPill
          count={total}
          reacted={filter === null}
          onPress={() => filterBy(null)}
        >
          <span className="text-sm font-extrabold">All</span>
        </ReactionPill>
        {tallies.map((reaction) => (
          <ReactionPill
            key={reaction.emoji}
            emoji={reaction.emoji}
            count={reaction.count}
            reacted={filter === reaction.emoji}
            onPress={() => filterBy(reaction.emoji)}
          />
        ))}
      </div>

      <div className="px-5">
        {loading ? (
          <SkeletonRows count={8} item={UserRowSkeleton} />
        ) : reactors.length === 0 ? (
          <EmptyState
            icon={SmilePlusIcon}
            title="Nobody yet"
            description="People who react like this turn up here."
            className="py-12"
          />
        ) : (
          reactors.map((reactor) => (
            <UserRow
              key={`${reactor.user.id}:${reactor.emoji}`}
              user={reactor.user}
              trailing={
                filter === null ? (
                  <span className="text-lg">{reactor.emoji}</span>
                ) : null
              }
            />
          ))
        )}
        <LoadMore onReach={loadMore} disabled={loading} />
        <ListFooter loading={loadingMore} />
      </div>
    </ActionSheet>
  )
}
