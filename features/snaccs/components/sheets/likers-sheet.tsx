import { HeartIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { UserRow } from "@/features/users/components/user-row"
import { UserRowSkeleton } from "@/features/users/components/user-row-skeleton"
import type { SnaccLiker } from "../../types"

export type LikersSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  likers: SnaccLiker[]
  loading: boolean
  loadingMore: boolean
  loadMore: () => void
}

export function LikersSheet({
  open,
  onOpenChange,
  likers,
  loading,
  loadingMore,
  loadMore,
}: LikersSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Likes" tall>
      <div className="px-5">
        {loading ? (
          <SkeletonRows count={8} item={UserRowSkeleton} />
        ) : likers.length === 0 ? (
          <EmptyState
            icon={HeartIcon}
            title="Nobody yet"
            description="People who like this turn up here."
            className="py-12"
          />
        ) : (
          likers.map((liker) => (
            <UserRow key={liker.user.id} user={liker.user} />
          ))
        )}
        <LoadMore onReach={loadMore} disabled={loading} />
        <ListFooter loading={loadingMore} />
      </div>
    </ActionSheet>
  )
}
