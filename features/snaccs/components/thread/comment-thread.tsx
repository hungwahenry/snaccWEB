import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { compactCount } from "@/lib/format"
import type { Snacc, SnaccReplyTo } from "../../types"
import { REPLY_INSET } from "@/features/snaccs/utils/layout"
import { SnaccCard, type SnaccActionHandlers } from "../card/snacc-card"

type CommentThreadProps = SnaccActionHandlers & {
  comment: Snacc
  replies: Snacc[]
  addresseeOf: (reply: Snacc) => SnaccReplyTo | null
  repliesOpen: boolean
  remaining: number
  busy: boolean
  onShowReplies: () => void
  onMoreReplies: () => void
  onHideReplies: () => void
  votingPollFor: string | null
}

export function CommentThread({
  comment,
  replies,
  addresseeOf,
  repliesOpen,
  remaining,
  busy,
  onShowReplies,
  onMoreReplies,
  onHideReplies,
  votingPollFor,
  ...actions
}: CommentThreadProps) {
  const done = repliesOpen && remaining === 0

  return (
    <div>
      <SnaccCard snacc={comment} votingPollFor={votingPollFor} {...actions} />

      {replies.map((reply) => (
        <SnaccCard
          key={reply.id}
          snacc={reply}
          addressee={addresseeOf(reply)}
          inset={REPLY_INSET}
          votingPollFor={votingPollFor}
          {...actions}
        />
      ))}

      {replies.length > 0 || remaining > 0 ? (
        <RepliesButton
          count={remaining}
          done={done}
          busy={busy}
          onPress={
            done ? onHideReplies : repliesOpen ? onMoreReplies : onShowReplies
          }
        />
      ) : null}
    </div>
  )
}

function RepliesButton({
  count,
  done,
  busy,
  onPress,
}: {
  count: number
  done: boolean
  busy: boolean
  onPress: () => void
}) {
  const noun = count === 1 ? "reply" : "replies"

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={busy}
      className="flex h-11 w-full items-center gap-1.5 border-b border-border text-sm font-bold text-muted-foreground transition-colors hover:bg-accent/40 disabled:opacity-60"
      style={{ paddingLeft: REPLY_INSET + 16 }}
    >
      {busy ? (
        <Spinner className="size-4" />
      ) : (
        <>
          {done ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
          {done ? "Hide replies" : `${compactCount(count)} ${noun}`}
        </>
      )}
    </button>
  )
}
