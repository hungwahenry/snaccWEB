import type { ReactNode, Ref } from "react"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import type { ThreadItem, ThreadMessage } from "../../types"
import { MessageThreadSkeleton } from "./message-thread-skeleton"
import { TypingIndicator } from "./typing-indicator"

/** A thread, newest at the bottom, in a DM or a room: only the rows and the empty words differ. */
export function ThreadView<T extends ThreadMessage>({
  scrollRef,
  onScroll,
  list,
  items,
  typing,
  failedTitle,
  empty,
  renderRow,
}: {
  scrollRef: Ref<HTMLDivElement>
  onScroll: () => void
  list: {
    loading: boolean
    failed: boolean
    retry: () => void
    loadingMore: boolean
    hasMore?: boolean
    loadMore: () => void
  }
  items: ThreadItem<T>[]
  /** Who is typing, or true when there is only one person it could be. */
  typing: string | boolean | null
  failedTitle: string
  empty: ReactNode
  renderRow: (item: ThreadItem<T>) => ReactNode
}) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4"
    >
      {list.loading ? (
        <MessageThreadSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          {list.failed ? (
            <LoadFailed title={failedTitle} onRetry={list.retry} />
          ) : (
            empty
          )}
        </div>
      ) : (
        <>
          <LoadMore
            onReach={list.loadMore}
            disabled={list.loadingMore || !list.hasMore}
          />
          <ListFooter loading={list.loadingMore} />
          <div className="flex-1" />
          {items.map(renderRow)}
          {typing ? (
            <TypingIndicator
              label={typeof typing === "string" ? typing : undefined}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
