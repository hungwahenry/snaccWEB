import type { LucideIcon } from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

type SearchResultsProps<T> = {
  items: T[]
  loading: boolean
  failed: boolean
  loadingMore: boolean
  onRetry: () => void
  onLoadMore: () => void
  skeleton: ComponentType
  failedTitle: string
  empty: { icon: LucideIcon; title: string; description: string }
  renderItem: (item: T) => ReactNode
}

/** One tab of results: rows shaped skeletons while it looks, a retry when it fails, a hint when nothing matches. */
export function SearchResults<T>({
  items,
  loading,
  failed,
  loadingMore,
  onRetry,
  onLoadMore,
  skeleton,
  failedTitle,
  empty,
  renderItem,
}: SearchResultsProps<T>) {
  if (loading) return <SkeletonRows count={8} item={skeleton} />

  if (failed && items.length === 0) {
    return (
      <div className="py-12">
        <LoadFailed title={failedTitle} onRetry={onRetry} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={empty.icon}
        title={empty.title}
        description={empty.description}
        className="py-16"
      />
    )
  }

  return (
    <>
      {items.map(renderItem)}
      <LoadMore onReach={onLoadMore} disabled={loadingMore} />
      <ListFooter loading={loadingMore} />
    </>
  )
}
