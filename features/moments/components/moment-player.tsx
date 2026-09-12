"use client"

import { EyeIcon, FlagIcon, Trash2Icon, XIcon } from "lucide-react"
import { useCallback, useState, type RefObject } from "react"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MomentClock } from "../hooks/use-moment-clock"
import type { Moment } from "../types"
import { MomentCard } from "./moment-card"
import { MomentGestures } from "./moment-gestures"
import { MomentPlayerSkeleton } from "./moment-player-skeleton"
import { MomentProgress } from "./moment-progress"
import { MomentReplyBar } from "./moment-reply-bar"

interface MomentPlayerProps {
  moments: Moment[]
  current: Moment | null
  index: number
  clock: MomentClock
  held: boolean
  pageRef: RefObject<HTMLDivElement | null>
  loading: boolean
  failed: boolean
  ready: boolean
  removing: boolean
  replying: boolean
  reactions: { quick: string[]; overflow: string | null }
  onRetry: () => void
  onMediaReady: (id: string) => void
  onPause: () => void
  onResume: () => void
  onHold: () => void
  onRelease: () => void
  onForward: () => void
  onBack: () => void
  onClose: () => void
  onNextAuthor: () => void
  onPreviousAuthor: () => void
  onViewers: () => void
  onDelete: () => void
  onReport: () => void
  onReact: (emoji: string) => void
  onReply: (body: string) => void
  onOpenAuthor: (username: string | null) => void
}

export function MomentPlayer({
  moments,
  current,
  index,
  clock,
  held,
  pageRef,
  loading,
  failed,
  ready,
  removing,
  replying,
  reactions,
  onRetry,
  onMediaReady,
  onPause,
  onResume,
  onHold,
  onRelease,
  onForward,
  onBack,
  onClose,
  onNextAuthor,
  onPreviousAuthor,
  onViewers,
  onDelete,
  onReport,
  onReact,
  onReply,
  onOpenAuthor,
}: MomentPlayerProps) {
  const [replyBarHeight, setReplyBarHeight] = useState(0)
  const measureReplyBar = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) =>
      setReplyBarHeight(entry.contentRect.height)
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (loading) return <MomentPlayerSkeleton />

  if (failed || !current) {
    return (
      <div className="flex h-full items-center justify-center bg-black px-8">
        <LoadFailed title="Could not load these moments" onRetry={onRetry} />
      </div>
    )
  }

  const chrome = cn(
    "transition-opacity duration-150",
    held && "pointer-events-none opacity-0"
  )

  return (
    <div
      ref={pageRef}
      className="relative flex h-full w-full flex-col bg-black select-none"
    >
      <MomentCard
        key={current.id}
        moment={current}
        ready={ready}
        bottomClearance={current.mine ? 0 : replyBarHeight}
        onReady={onMediaReady}
      />

      <MomentGestures
        onForward={onForward}
        onBack={onBack}
        onHold={onHold}
        onRelease={onRelease}
        onClose={onClose}
        onNextAuthor={onNextAuthor}
        onPreviousAuthor={onPreviousAuthor}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[calc(env(safe-area-inset-top)+120px)] bg-gradient-to-b from-black/55 to-transparent",
          chrome
        )}
      />

      <div
        className={cn(
          "absolute inset-x-0 top-0 pt-[calc(env(safe-area-inset-top)+8px)]",
          chrome
        )}
      >
        <MomentProgress count={moments.length} index={index} clock={clock} />

        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => onOpenAuthor(current.author.username)}
            disabled={!current.author.username}
            aria-label={`Open ${current.author.username ?? "their"} profile`}
            className="flex min-w-0 flex-1 items-center gap-3 text-left transition-opacity active:opacity-80"
          >
            <UserAvatar
              className="size-8"
              alt={current.author.username ?? "Someone"}
              avatarUrl={current.author.avatar_url}
              name={current.author.display_name}
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-bold text-white">
                {current.author.username ?? "Someone"}
              </span>
              <span className="text-xs text-white/70">
                {timeAgo(current.created_at)}
              </span>
            </span>
          </button>

          {current.mine ? (
            <button
              type="button"
              disabled={removing}
              onClick={onDelete}
              aria-label="Take this down"
              className="p-1 text-white"
            >
              {removing ? (
                <Spinner className="size-5" />
              ) : (
                <Trash2Icon className="size-5" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onReport}
              aria-label="Report this moment"
              className="p-1 text-white"
            >
              <FlagIcon className="size-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-white"
          >
            <XIcon className="size-6" />
          </button>
        </div>
      </div>

      {current.mine ? (
        <div
          className={cn(
            "absolute right-4 bottom-0 pb-[calc(env(safe-area-inset-bottom)+16px)]",
            chrome
          )}
        >
          <button
            type="button"
            onClick={onViewers}
            aria-label={`${current.views_count} views. Opens who has seen this.`}
            className="flex items-center gap-1.5 rounded-full border-2 border-white/70 bg-black/35 px-3.5 py-2 text-sm font-bold text-white transition-opacity active:opacity-70"
          >
            <EyeIcon className="size-4" />
            {current.views_count}
          </button>
        </div>
      ) : (
        <div
          ref={measureReplyBar}
          className={cn(
            "absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]",
            chrome
          )}
        >
          <MomentReplyBar
            reaction={current.my_reaction}
            quick={reactions.quick}
            overflow={reactions.overflow}
            onReact={onReact}
            onReply={onReply}
            replying={replying}
            onFocus={onPause}
            onBlur={onResume}
          />
        </div>
      )}
    </div>
  )
}
