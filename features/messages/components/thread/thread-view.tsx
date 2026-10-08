import type { ReactNode, Ref } from "react"
import { cn } from "@/lib/utils"
import { ChatBackdrop } from "@/features/chat-themes/components/chat-backdrop"
import type { ChatPaint } from "@/features/chat-themes/types"
import { threadColors } from "@/features/chat-themes/utils/paint"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import type { ThreadItem, ThreadMessage } from "../../types"
import { MessageThreadSkeleton } from "./message-thread-skeleton"
import { ThreadLineRow } from "./thread-line-row"
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
  paint = null,
  photoUrl = null,
  seeking = false,
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
  paint?: ChatPaint | null
  photoUrl?: string | null
  seeking?: boolean
}) {
  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      style={paint ? threadColors(paint) : undefined}
    >
      {paint ? <ChatBackdrop paint={paint} photoUrl={photoUrl} /> : null}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={cn(
          "relative min-h-0 flex-1 overflow-y-auto",
          seeking && "invisible"
        )}
      >
        <div className="flex min-h-full flex-col px-3 py-4">
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
              {items.map((item) =>
                item.message.line ? (
                  <ThreadLineRow
                    key={item.message.id}
                    line={item.message.line}
                    time={item.time}
                    dayBreak={item.dayBreak}
                  />
                ) : (
                  renderRow(item)
                )
              )}
              <TypingIndicator typing={typing} />
            </>
          )}
        </div>
      </div>
      {seeking ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex flex-col px-3 py-4"
        >
          <MessageThreadSkeleton />
        </div>
      ) : null}
    </div>
  )
}
