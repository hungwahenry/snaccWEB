import type { LucideIcon } from "lucide-react"
import type { ReactNode, Ref } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import type { Snacc } from "../types"
import { SnaccCard, type SnaccActionHandlers } from "./card/snacc-card"
import { SnaccCardSkeleton } from "./card/snacc-card-skeleton"

export type SnaccListProps = {
  snaccs: Snacc[]
  loading: boolean
  failed: boolean
  loadingMore: boolean
  onRetry: () => void
  onLoadMore: () => void
  handlers: SnaccActionHandlers
  votingPollFor: string | null
  itemRef?: (id: string) => Ref<HTMLElement>
  header?: ReactNode
  empty: {
    icon: LucideIcon
    title: string
    description?: string
    action?: ReactNode
  }
  failedTitle: string
  skeletonCount?: number
  renderItem?: (snacc: Snacc) => ReactNode
}

export function SnaccList({
  snaccs,
  loading,
  failed,
  loadingMore,
  onRetry,
  onLoadMore,
  handlers,
  votingPollFor,
  itemRef,
  header,
  empty,
  failedTitle,
  skeletonCount = 6,
  renderItem,
}: SnaccListProps) {
  if (loading) {
    return (
      <>
        {header}
        <SkeletonRows count={skeletonCount} item={SnaccCardSkeleton} />
      </>
    )
  }

  if (failed && snaccs.length === 0) {
    return (
      <>
        {header}
        <div className="py-12">
          <LoadFailed title={failedTitle} onRetry={onRetry} />
        </div>
      </>
    )
  }

  return (
    <>
      {header}
      {snaccs.length === 0 ? (
        <EmptyState
          icon={empty.icon}
          title={empty.title}
          description={empty.description}
          action={empty.action}
          className="py-24"
        />
      ) : (
        snaccs.map((snacc) =>
          renderItem ? (
            renderItem(snacc)
          ) : (
            <SnaccCard
              key={snacc.id}
              snacc={snacc}
              votingPollFor={votingPollFor}
              itemRef={itemRef?.(snacc.id)}
              {...handlers}
            />
          )
        )
      )}
      <LoadMore onReach={onLoadMore} disabled={loading || loadingMore} />
      <ListFooter loading={loadingMore} />
    </>
  )
}
