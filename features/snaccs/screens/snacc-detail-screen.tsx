"use client"

import {
  EyeIcon,
  MessageCircleDashedIcon,
  MessageCirclePlusIcon,
  MessageSquareDashedIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useRecordView } from "@/features/views/hooks/use-record-view"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { useBack } from "@/hooks/use-back"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { isNotFound } from "@/lib/api/errors"
import { compactCount } from "@/lib/format"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { SnaccCard } from "../components/card/snacc-card"
import { SnaccCardSkeleton } from "../components/card/snacc-card-skeleton"
import { CommentThreadItem } from "@/features/snaccs/containers/comment-thread-item"
import { SnaccSheets } from "../components/sheets/snacc-sheets"
import { CommentSortRow } from "../components/thread/comment-sort-row"
import { CommentSortSheet } from "../components/thread/comment-sort-sheet"
import { ReplyContext } from "../components/thread/reply-context"
import { useComments } from "../hooks/thread/use-comments"
import { useSnacc } from "../hooks/use-snacc"
import { useSnaccActions } from "../hooks/use-snacc-actions"
import { composePath, snaccPath } from "../routes"
import type { CommentSort, Snacc } from "../types"
import { DEFAULT_COMMENT_SORT, REPLY_SORT } from "../utils/sorts"
import { addresseeOf } from "../utils/threads"

export function SnaccDetailScreen({ id }: { id: string }) {
  const router = useRouter()
  const back = useBack()
  useRealtimeRoom(realtimeRooms.snacc(id))
  const snacc = useSnacc(id)
  const tracker = useSnaccTracker()

  const loaded = snacc.data
  const isPost = loaded ? loaded.parent_id === null : undefined
  const parent = useSnacc(loaded?.parent_id ?? "")

  useRecordView(loaded?.id)

  const notAvailable = snacc.isError && isNotFound(snacc.error)

  const [sort, setSort] = useState<CommentSort>(DEFAULT_COMMENT_SORT)
  const [sortOpen, setSortOpen] = useState(false)
  const comments = useComments(id, isPost === false ? REPLY_SORT : sort, {
    enabled: isPost !== undefined,
  })

  const reply = (target: Snacc) =>
    router.push(composePath({ parentId: target.id }))
  const { handlers, votingPollFor, sheets } = useSnaccActions({
    onComment: reply,
  })

  return (
    <div className="flex min-h-[calc(100dvh-var(--tab-bar-height))] flex-col md:min-h-dvh">
      <BackHeader
        title={isPost === undefined ? "" : isPost ? "Snacc" : "Comment"}
        onBack={back}
        right={
          loaded?.mine ? (
            <span
              className="flex items-center gap-1.5 pr-2 text-sm font-bold text-muted-foreground tabular-nums"
              aria-label={`${loaded.views_count} views`}
            >
              <EyeIcon className="size-4" /> {compactCount(loaded.views_count)}
            </span>
          ) : undefined
        }
      />

      {notAvailable ? (
        <div className="py-24">
          <EmptyState
            icon={MessageSquareDashedIcon}
            title="This snacc isn't available"
            description="It may have been deleted, or hidden."
          />
        </div>
      ) : snacc.isError ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this snacc"
            onRetry={() => void snacc.refetch()}
          />
        </div>
      ) : !loaded ? (
        <SkeletonRows count={5} item={SnaccCardSkeleton} />
      ) : (
        <>
          {parent.data ? (
            <ReplyContext
              snacc={parent.data}
              onPress={() => router.push(snaccPath(parent.data!.id))}
              onPressImage={(index) =>
                handlers.onOpenImages(parent.data!, index)
              }
              poll={{
                voting: votingPollFor === parent.data.id,
                onVote: (optionId) => handlers.onVote(parent.data!, optionId),
                onOpenImage: (option) =>
                  handlers.onOpenPollImage(parent.data!, option),
              }}
            />
          ) : null}

          <SnaccCard
            snacc={loaded}
            flushTop={!!parent.data}
            votingPollFor={votingPollFor}
            {...handlers}
            onPress={undefined}
          />

          {isPost && loaded.comments_count > 0 ? (
            <CommentSortRow
              value={sort}
              total={loaded.comments_count}
              onPress={() => setSortOpen(true)}
            />
          ) : null}

          {comments.failed && comments.comments.length === 0 ? (
            <LoadFailed
              title={`Could not load ${isPost ? "comments" : "replies"}`}
              onRetry={comments.retry}
            />
          ) : comments.loading ? (
            <SkeletonRows count={4} item={SnaccCardSkeleton} />
          ) : comments.comments.length === 0 ? (
            <EmptyState
              icon={MessageCircleDashedIcon}
              title={isPost ? "No comments yet" : "No replies yet"}
              description={
                isPost ? "Start the conversation." : "Say something back."
              }
            />
          ) : (
            comments.comments.map((item) =>
              isPost ? (
                <CommentThreadItem
                  key={item.id}
                  comment={item}
                  votingPollFor={votingPollFor}
                  {...handlers}
                />
              ) : (
                <SnaccCard
                  key={item.id}
                  snacc={item}
                  addressee={addresseeOf(item, loaded.author.id)}
                  votingPollFor={votingPollFor}
                  itemRef={tracker.ref(item.id)}
                  {...handlers}
                  onPress={undefined}
                />
              )
            )
          )}
          <LoadMore
            onReach={comments.loadMore}
            disabled={comments.loading || comments.loadingMore}
          />
          <ListFooter loading={comments.loadingMore} />

          <div className="pointer-events-none sticky bottom-(--fab-bottom) z-20 mt-auto flex justify-end px-4 pt-4 md:bottom-6">
            <Button
              size="lg"
              className="pointer-events-auto h-12 gap-2 rounded-full px-5 shadow-lg"
              onClick={() => reply(loaded)}
            >
              <MessageCirclePlusIcon className="size-5" />
              <span className="text-base font-extrabold">Reply</span>
            </Button>
          </div>
        </>
      )}

      <CommentSortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        value={sort}
        onSelect={(next) => {
          setSort(next)
          setSortOpen(false)
        }}
      />
      <SnaccSheets {...sheets} />
    </div>
  )
}
